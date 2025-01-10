import { WebSocketRcon } from 'ws-rcon-client';
import { RconLogger } from './RconLogger';
import { RCON_CONFIG } from './config';
import type { PlayerList } from './types';

export class RconServer {
  private static instance: RconServer;
  private rcon: WebSocketRcon | null = null;
  private connecting: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): RconServer {
    if (!RconServer.instance) {
      RconServer.instance = new RconServer();
    }
    return RconServer.instance;
  }

  async connect(): Promise<void> {
    if (this.connecting) return this.connecting;
    if (this.rcon?.isConnected()) return;

    this.connecting = this.establishConnection();

    try {
      await this.connecting;
      RconLogger.info('RCON server connected successfully');
    } catch (error) {
      RconLogger.error('RCON connection failed', error);
      throw error;
    } finally {
      this.connecting = null;
    }
  }

  private async establishConnection(): Promise<void> {
    try {
      if (this.rcon) await this.disconnect();

      this.rcon = new WebSocketRcon({
        host: RCON_CONFIG.host,
        port: RCON_CONFIG.port,
        password: RCON_CONFIG.password,
        timeout: RCON_CONFIG.timeout,
        encoding: 'utf8',
        maxPacketSize: 4096
      });

      await this.rcon.connect();
    } catch (error) {
      throw new Error(`Failed to establish RCON connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listPlayers(): Promise<PlayerList> {
    try {
      const response = await this.executeCommand('listplayers');
      return this.parsePlayerList(response);
    } catch (error) {
      RconLogger.error('Failed to list players', error);
      throw error;
    }
  }

  private parsePlayerList(response: string): PlayerList {
    // Parse the response into a structured format
    const lines = response.split('\n').filter(line => line.trim());
    const players = lines.map(line => {
      const [name, ...info] = line.split(',').map(s => s.trim());
      return { name, info: info.join(', ') };
    });

    return {
      count: players.length,
      players,
      timestamp: new Date().toISOString()
    };
  }

  async executeCommand(command: string): Promise<string> {
    if (!this.rcon?.isConnected()) {
      throw new Error('Not connected to server');
    }

    try {
      const response = await this.rcon.send(command);
      RconLogger.debug('Command executed', { command, response });
      return response;
    } catch (error) {
      RconLogger.error('Command execution failed', { command, error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.rcon) {
      try {
        await this.rcon.disconnect();
      } finally {
        this.rcon = null;
      }
    }
  }
}
