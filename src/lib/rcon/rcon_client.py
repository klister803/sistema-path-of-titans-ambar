import socket
import struct
import time
from typing import Optional

class RconClient:
    """
    Cliente RCON para comunicação com servidor de jogo
    """
    
    SERVERDATA_AUTH = 3
    SERVERDATA_EXECCOMMAND = 2
    SERVERDATA_AUTH_RESPONSE = 2
    SERVERDATA_RESPONSE_VALUE = 0
    
    def __init__(self, host: str, port: int, password: str):
        """
        Inicializa o cliente RCON com os parâmetros de conexão
        
        Args:
            host: Endereço IP do servidor
            port: Porta RCON 
            password: Senha RCON
        """
        self.host = host
        self.port = port
        self.password = password
        self.socket: Optional[socket.socket] = None
        self.authenticated = False
        
    def connect(self) -> bool:
        """
        Estabelece conexão com o servidor e realiza autenticação
        
        Returns:
            bool: True se autenticado com sucesso, False caso contrário
        """
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.settimeout(10.0)
            self.socket.connect((self.host, self.port))
            
            # Envia pacote de autenticação
            auth_response = self._send_packet(
                self.SERVERDATA_AUTH,
                self.password
            )
            
            # Verifica resposta
            self.authenticated = auth_response == self.SERVERDATA_AUTH_RESPONSE
            return self.authenticated
            
        except Exception as e:
            print(f"Erro ao conectar: {str(e)}")
            self.disconnect()
            return False
            
    def disconnect(self):
        """Fecha a conexão com o servidor"""
        if self.socket:
            self.socket.close()
            self.socket = None
        self.authenticated = False
        
    def send_command(self, command: str) -> str:
        """
        Envia comando para o servidor
        
        Args:
            command: Comando a ser executado
            
        Returns:
            str: Resposta do servidor
            
        Raises:
            ConnectionError: Se não estiver conectado/autenticado
        """
        if not self.authenticated or not self.socket:
            raise ConnectionError("Não conectado ao servidor")
            
        try:
            response = self._send_packet(
                self.SERVERDATA_EXECCOMMAND,
                command
            )
            return response
            
        except Exception as e:
            raise ConnectionError(f"Erro ao enviar comando: {str(e)}")
            
    def _send_packet(self, packet_type: int, payload: str) -> str:
        """
        Envia pacote RCON formatado
        
        Args:
            packet_type: Tipo do pacote
            payload: Conteúdo do pacote
            
        Returns:
            str: Resposta do servidor
        """
        # Gera ID aleatório para o pacote
        packet_id = int(time.time() * 1000) & 0x0FFFFFFF
        
        # Monta o pacote
        encoded_payload = payload.encode('utf-8')
        packet_size = struct.pack('<l', len(encoded_payload) + 10)
        packet_id_bytes = struct.pack('<l', packet_id)
        packet_type_bytes = struct.pack('<l', packet_type)
        
        # Envia o pacote
        packet = packet_size + packet_id_bytes + packet_type_bytes + encoded_payload + b'\x00\x00'
        self.socket.send(packet)
        
        # Recebe e processa resposta
        response_size = struct.unpack('<l', self.socket.recv(4))[0]
        response_data = self.socket.recv(response_size)
        
        # Extrai dados da resposta
        response_id = struct.unpack('<l', response_data[0:4])[0]
        response_type = struct.unpack('<l', response_data[4:8])[0]
        response_payload = response_data[8:-2].decode('utf-8')
        
        return response_payload

# Exemplo de uso
if __name__ == '__main__':
    # Parâmetros de conexão
    HOST = '140.238.185.252'
    PORT = 7779
    PASSWORD = 'Ambar@3'
    
    # Cria cliente
    rcon = RconClient(HOST, PORT, PASSWORD)
    
    try:
        # Conecta ao servidor
        if rcon.connect():
            print("Conectado com sucesso!")
            
            # Envia comando de teste
            response = rcon.send_command("help")
            print(f"Resposta: {response}")
            
        else:
            print("Falha ao conectar")
            
    except Exception as e:
        print(f"Erro: {str(e)}")
        
    finally:
        rcon.disconnect()
