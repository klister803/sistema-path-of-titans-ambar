import logging
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mcrcon import MCRcon
import asyncio
import uvicorn

# Configuração de Log
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Modelos Pydantic
class CommandRequest(BaseModel):
    command: str

class CommandResponse(BaseModel):
    success: bool
    command: str
    response: str
    timestamp: datetime

class ServerStatus(BaseModel):
    status: str
    players: int
    max_players: int
    uptime: str

# Gerenciador de Conexão RCON
class RconManager:
    def __init__(self, host: str, port: int, password: str):
        self.host = host
        self.port = port
        self.password = password
        self.mcr = None

    def initialize(self):
        try:
            self.mcr = MCRcon(self.host, self.password, self.port)
            self.mcr.connect()
            logger.debug("Conexão RCON estabelecida")
        except Exception as e:
            logger.error(f"Falha ao conectar ao RCON: {e}")
            raise

    def reconnect(self):
        logger.debug("Tentando reconectar ao RCON...")
        self.cleanup()
        self.initialize()

    def cleanup(self):
        try:
            if self.mcr:
                self.mcr.disconnect()
                logger.debug("Conexão RCON encerrada")
        except Exception as e:
            logger.error(f"Erro ao encerrar conexão RCON: {e}")

    def execute_command(self, command: str) -> str:
        try:
            logger.debug(f"Executando comando: {command}")
            response = self.mcr.command(command)
            logger.debug(f"Resposta do comando: {response}")
            return response
        except Exception as e:
            logger.error(f"Erro ao executar comando '{command}': {e}")
            try:
                self.reconnect()
                logger.debug("Reconexão bem-sucedida. Tentando executar o comando novamente.")
                response = self.mcr.command(command)
                logger.debug(f"Resposta do comando após reconexão: {response}")
                return response
            except Exception as recon_e:
                logger.error(f"Falha na reconexão: {recon_e}")
                raise

    def get_status(self) -> ServerStatus:
        try:
            logger.debug("Obtendo status do servidor")
            players_response = self.mcr.command("list")
            if ":" in players_response:
                player_list = players_response.split(":")[1].strip()
                players = len([p for p in player_list.split(",") if p.strip()])
            else:
                players = 0
            max_players_response = self.mcr.command("maxplayers")
            max_players = int(max_players_response) if max_players_response.isdigit() else 0
            uptime = self.mcr.command("uptime")
            status = ServerStatus(
                status="online",
                players=players,
                max_players=max_players,
                uptime=uptime
            )
            logger.debug(f"Status do servidor: {status}")
            return status
        except Exception as e:
            logger.error(f"Erro ao obter status do servidor: {e}")
            try:
                self.reconnect()
                logger.debug("Reconexão bem-sucedida. Tentando obter o status novamente.")
                players_response = self.mcr.command("list")
                if ":" in players_response:
                    player_list = players_response.split(":")[1].strip()
                    players = len([p for p in player_list.split(",") if p.strip()])
                else:
                    players = 0
                max_players_response = self.mcr.command("maxplayers")
                max_players = int(max_players_response) if max_players_response.isdigit() else 0
                uptime = self.mcr.command("uptime")
                status = ServerStatus(
                    status="online",
                    players=players,
                    max_players=max_players,
                    uptime=uptime
                )
                logger.debug(f"Status do servidor após reconexão: {status}")
                return status
            except Exception as recon_e:
                logger.error(f"Falha na reconexão e obtenção do status: {recon_e}")
                raise

    def send_whisper(self, username: str, message: str) -> str:
        try:
            command = f"whisper {username} {message}"
            logger.debug(f"Enviando whisper: {command}")
            response = self.mcr.command(command)
            logger.debug(f"Resposta do whisper: {response}")
            return response
        except Exception as e:
            logger.error(f"Erro ao enviar whisper para {username}: {e}")
            try:
                self.reconnect()
                logger.debug(f"Reconexão bem-sucedida. Tentando enviar whisper novamente para {username}.")
                response = self.mcr.command(command)
                logger.debug(f"Resposta do whisper após reconexão: {response}")
                return response
            except Exception as recon_e:
                logger.error(f"Falha na reconexão e envio do whisper para {username}: {recon_e}")
                raise

# Função de Lifespan com Tratamento de Exceções
def lifespan(app: FastAPI):
    rcon = RconManager(host="140.238.185.252", port=7779, password="Ambar@3")
    try:
        rcon.initialize()
        app.state.rcon = rcon
    except Exception as e:
        logger.error("Inicialização do RCON falhou")
        app.state.rcon = None
    try:
        yield
    finally:
        if app.state.rcon:
            app.state.rcon.cleanup()

# Instância do FastAPI
app = FastAPI(
    title="RCON API",
    description="API para gerenciar conexões e comandos RCON",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Atenção: em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependência para Obter o RconManager
def get_rcon():
    rcon = app.state.rcon
    if not rcon:
        raise HTTPException(status_code=503, detail="Serviço RCON indisponível")
    return rcon

# Rota para Executar Comandos
@app.post("/rcon/command", response_model=CommandResponse)
def execute_command(
    request: CommandRequest,
    rcon: RconManager = Depends(get_rcon)
):
    try:
        response = await rcon.execute_command(request.command)
        return CommandResponse(
            success=True,
            command=request.command,
            response=response,
            timestamp=datetime.utcnow()
        )
    except Exception as e:
        logger.error(f"Falha na execução do comando: {e}")
        raise HTTPException(status_code=500, detail="Falha na execução do comando")

# Rota para Obter Status do Servidor
@app.get("/rcon/status", response_model=ServerStatus)
def get_status(rcon: RconManager = Depends(get_rcon)):
    try:
        status = rcon.get_status()
        return status
    except Exception as e:
        logger.error(f"Falha ao obter status do servidor: {e}")
        raise HTTPException(status_code=500, detail="Falha ao obter status do servidor")

# Rota para enviar whisper
@app.post("/rcon/whisper", response_model=CommandResponse)
async def send_whisper(
    request: CommandRequest,
    rcon: RconManager = Depends(get_rcon)
):
    try:
        response = await rcon.send_whisper(request.command.split(" ")[0], request.command.split(" ")[1])
        return CommandResponse(
            success=True,
            command=request.command,
            response=response,
            timestamp=datetime.utcnow()
        )
    except Exception as e:
        logger.error(f"Falha ao enviar whisper: {e}")
        raise HTTPException(status_code=500, detail="Falha ao enviar whisper")

# Ponto de Entrada do Aplicativo
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
