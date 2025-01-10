import socket
import struct
import time
from typing import Optional, Dict, Any
from dataclasses import dataclass

@dataclass
class ConfiguracaoRcon:
    host: str
    porta: int
    senha: str
    timeout: float = 10.0

class ClienteRcon:
    """Cliente RCON para comunicação com servidor de jogo"""
    
    # Constantes do protocolo RCON
    TIPO_AUTENTICACAO = 3
    TIPO_COMANDO = 2
    TIPO_RESPOSTA_AUTH = 2
    TIPO_RESPOSTA_VALOR = 0
    
    def __init__(self, config: ConfiguracaoRcon):
        self.config = config
        self.socket: Optional[socket.socket] = None
        self.autenticado = False
        
    def conectar(self) -> bool:
        """Estabelece conexão com o servidor e realiza autenticação"""
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.settimeout(self.config.timeout)
            self.socket.connect((self.config.host, self.config.porta))
            
            resposta_auth = self._enviar_pacote(
                self.TIPO_AUTENTICACAO,
                self.config.senha
            )
            
            self.autenticado = resposta_auth == self.TIPO_RESPOSTA_AUTH
            return self.autenticado
            
        except Exception as e:
            print(f"Erro de conexão: {str(e)}")
            self.desconectar()
            return False
            
    def desconectar(self):
        """Fecha a conexão com o servidor"""
        if self.socket:
            self.socket.close()
            self.socket = None
        self.autenticado = False
        
    def enviar_comando(self, comando: str) -> Dict[str, Any]:
        """
        Envia comando para o servidor
        
        Args:
            comando: Comando a ser executado
            
        Returns:
            Dict contendo status e resultado/erro
        """
        if not self.autenticado or not self.socket:
            return {
                "sucesso": False,
                "erro": "Não conectado ao servidor"
            }
            
        try:
            resposta = self._enviar_pacote(self.TIPO_COMANDO, comando)
            return {
                "sucesso": True,
                "dados": resposta
            }
            
        except Exception as e:
            return {
                "sucesso": False,
                "erro": f"Erro ao executar comando: {str(e)}"
            }
            
    def _enviar_pacote(self, tipo_pacote: int, payload: str) -> str:
        """
        Envia pacote RCON formatado
        
        Args:
            tipo_pacote: Tipo do pacote RCON
            payload: Conteúdo do pacote
            
        Returns:
            str: Resposta do servidor
        """
        id_pacote = int(time.time() * 1000) & 0x0FFFFFFF
        
        payload_codificado = payload.encode('utf-8')
        tamanho_pacote = struct.pack('<l', len(payload_codificado) + 10)
        bytes_id = struct.pack('<l', id_pacote)
        bytes_tipo = struct.pack('<l', tipo_pacote)
        
        pacote = tamanho_pacote + bytes_id + bytes_tipo + payload_codificado + b'\x00\x00'
        self.socket.send(pacote)
        
        tamanho_resposta = struct.unpack('<l', self.socket.recv(4))[0]
        dados_resposta = self.socket.recv(tamanho_resposta)
        
        id_resposta = struct.unpack('<l', dados_resposta[0:4])[0]
        tipo_resposta = struct.unpack('<l', dados_resposta[4:8])[0]
        payload_resposta = dados_resposta[8:-2].decode('utf-8')
        
        return payload_resposta
