import axios from 'axios';

const RCON_API_URL = 'http://localhost:8000/rcon';

export interface RconCommandResponse {
  success: boolean;
  command: string;
  response: string;
  timestamp: string;
  error?: string;
}

export interface ServerStatus {
  status: string;
  players: number;
  max_players: number;
  uptime: string;
}

export interface PlayerAttribute {
  name: string;
  value: string;
}

export const rconApi = {
  async executeCommand(command: string): Promise<RconCommandResponse> {
    try {
      const response = await axios.post(`${RCON_API_URL}/command`, { command });
      return response.data;
    } catch (error) {
      console.error('RCON command error:', error);
      throw error;
    }
  },

  async getServerStatus(): Promise<ServerStatus> {
    try {
      const response = await axios.get(`${RCON_API_URL}/status`);
      return response.data;
    } catch (error) {
      console.error('RCON status error:', error);
      throw error;
    }
  },
  async getPlayerAttribute(username: string, attribute: string): Promise<RconCommandResponse> {
    try {
      const command = `GetAttr ${username} ${attribute}`;
      const response = await axios.post(`${RCON_API_URL}/command`, { command });
      return response.data;
    } catch (error) {
      console.error(`RCON get attribute error for ${attribute}:`, error);
      throw error;
    }
  }
};
