import { Rcon } from 'rcon-srcds';
import { RconResponse } from '../../types/rcon';
import { retryWithBackoff } from '../utils/retry';
import { RconLogger } from './RconLogger';

export class RconClient {
  private static instance: RconClient;
  private rcon: Rcon | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnects = 3;

  private constructor() {}

  static getInstance(): RconClient {
    if (!RconClient.instance) {
      RconClient.instance = new RconClient();
    }
    return RconClient.instance;
  }

  private async connect(): Promise<void> {
    if (this.rcon?.authenticated) return;

    try {
      RconLogger.info('Connecting to RCON server...');
      
      this.rcon = new Rcon({
        host: '140.238.185.252',
        port: 7779,
        password: 'Ambar@3',
        timeout: 5000,
      });

      await this.rcon.connect();
      RconLogger.info('RCON connection successful');
    } catch (error) {
      RconLogger.error('RCON connection failed', error);
      throw error;
    }
  }

  async sendCommand(command: string): Promise<RconResponse> {
    try {
      await retryWithBackoff(
        async () => {
          if (!this.rcon?.authenticated) {
            await this.connect();
          }
        },
        {
          maxAttempts: this.maxReconnects,
          onError: async (error) => {
            RconLogger.error('Connection attempt failed', error);
            this.reconnectAttempts++;
            if (this.rcon) {
              await this.rcon.disconnect();
              this.rcon = null;
            }
          }
        }
      );

      if (!this.rcon?.authenticated) {
        throw new Error('Failed to establish connection');
      }

      RconLogger.debug('Sending command', { command });
      const response = await this.rcon.execute(command);
      RconLogger.debug('Command response', { command, response });

      return {
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      RconLogger.error('Command execution failed', { command, error: errorMessage });
      
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      };
    }
  }

  async disconnect(): Promise<void> {
    if (this.rcon) {
      try {
        await this.rcon.disconnect();
      } finally {
        this.rcon = null;
        this.reconnectAttempts = 0;
      }
    }
  }
}
