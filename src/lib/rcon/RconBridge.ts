import { RconResponse } from '../../types/rcon';

declare global {
  interface Window {
    pyodide: any;
  }
}

export class RconBridge {
  private static instance: RconBridge;
  private pyodideReady: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {
    this.initializePyodide();
  }

  static getInstance(): RconBridge {
    if (!RconBridge.instance) {
      RconBridge.instance = new RconBridge();
    }
    return RconBridge.instance;
  }

  private async initializePyodide() {
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = new Promise(async (resolve) => {
      // Wait for PyScript to be ready
      const checkPyodide = setInterval(() => {
        if (window.pyodide) {
          clearInterval(checkPyodide);
          this.setupRconClient().then(resolve);
        }
      }, 100);
    });

    return this.connectionPromise;
  }

  private async setupRconClient() {
    const pythonCode = `
import socket
import struct
import time
from typing import Optional

class RconClient:
    SERVERDATA_AUTH = 3
    SERVERDATA_EXECCOMMAND = 2
    SERVERDATA_AUTH_RESPONSE = 2
    SERVERDATA_RESPONSE_VALUE = 0
    
    def __init__(self, host: str, port: int, password: str):
        self.host = host
        self.port = port
        self.password = password
        self.socket = None
        self.authenticated = False
        
    def connect(self) -> bool:
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.settimeout(10.0)
            self.socket.connect((self.host, self.port))
            
            auth_response = self._send_packet(
                self.SERVERDATA_AUTH,
                self.password
            )
            
            self.authenticated = auth_response == self.SERVERDATA_AUTH_RESPONSE
            return self.authenticated
            
        except Exception as e:
            print(f"Connection error: {str(e)}")
            self.disconnect()
            return False
            
    def disconnect(self):
        if self.socket:
            self.socket.close()
            self.socket = None
        self.authenticated = False
        
    def send_command(self, command: str) -> str:
        if not self.authenticated or not self.socket:
            raise ConnectionError("Not connected to server")
            
        try:
            response = self._send_packet(
                self.SERVERDATA_EXECCOMMAND,
                command
            )
            return response
            
        except Exception as e:
            raise ConnectionError(f"Command error: {str(e)}")
            
    def _send_packet(self, packet_type: int, payload: str) -> str:
        packet_id = int(time.time() * 1000) & 0x0FFFFFFF
        
        encoded_payload = payload.encode('utf-8')
        packet_size = struct.pack('<l', len(encoded_payload) + 10)
        packet_id_bytes = struct.pack('<l', packet_id)
        packet_type_bytes = struct.pack('<l', packet_type)
        
        packet = packet_size + packet_id_bytes + packet_type_bytes + encoded_payload + b'\\x00\\x00'
        self.socket.send(packet)
        
        response_size = struct.unpack('<l', self.socket.recv(4))[0]
        response_data = self.socket.recv(response_size)
        
        response_id = struct.unpack('<l', response_data[0:4])[0]
        response_type = struct.unpack('<l', response_data[4:8])[0]
        response_payload = response_data[8:-2].decode('utf-8')
        
        return response_payload

rcon_client = RconClient('140.238.185.252', 7779, 'Ambar@3')
    `;

    await window.pyodide.runPython(pythonCode);
    this.pyodideReady = true;
  }

  async sendCommand(command: string): Promise<RconResponse> {
    if (!this.pyodideReady) {
      await this.connectionPromise;
    }

    try {
      const result = await window.pyodide.runPython(`
        try:
          if not rcon_client.authenticated:
            rcon_client.connect()
          response = rcon_client.send_command("${command}")
          {"success": True, "data": response}
        except Exception as e:
          {"success": False, "error": str(e)}
      `);

      return {
        ...result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }
}
