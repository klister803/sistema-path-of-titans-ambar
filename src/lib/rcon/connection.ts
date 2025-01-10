import { WebSocketRcon } from 'ws-rcon-client';
import { RCON_CONFIG } from './config';
import { RconConnectionState, RconEvents } from './types';
import { RconMonitor } from './RconMonitor';
import { RconLogger } from './RconLogger';

export class RconConnection {
  private rcon: WebSocketRcon | null = null;
  private connecting: Promise<void> | null = null;
  private monitor: RconMonitor;

  constructor(private events: RconEvents) {
    this.monitor = RconMonitor.getInstance();
  }

  getState(): RconConnectionState {
    return this.monitor.getState();
  }

  async connect(): Promise<void> {
    if (this.connecting) return this.connecting;
    if (this.rcon?.isConnected()) return;

    this.monitor.updateState({ isConnecting: true });
    this.connecting = this.establishConnection();

    try {
      await this.connecting;
      this.monitor.updateState({ 
        isAuthenticated: true,
        lastError: null,
        isConnecting: false 
      });
      this.events.onConnect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.monitor.updateState({
        isAuthenticated: false,
        lastError: errorMessage,
        isConnecting: false
      });
      this.monitor.logError(new Error(errorMessage));
      this.events.onError(new Error(errorMessage));
      throw error;
    } finally {
      this.connecting = null;
    }
  }

  private async establishConnection(): Promise<void> {
    try {
      RconLogger.info('Establishing RCON connection', {
        host: RCON_CONFIG.host,
        port: RCON_CONFIG.port
      });

      if (this.rcon) await this.disconnect();

      this.rcon = new WebSocketRcon({
        host: RCON_CONFIG.host,
        port: RCON_CONFIG.port,
        password: RCON_CONFIG.password,
        timeout: RCON_CONFIG.timeout
      });

      this.setupEventHandlers();
      await this.rcon.connect();
      RconLogger.info('RCON connection established successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      RconLogger.error('RCON connection failed', error);
      throw new Error(errorMessage);
    }
  }

  private setupEventHandlers(): void {
    if (!this.rcon) return;

    this.rcon.on('error', (error: Error) => {
      this.monitor.logError(error);
      this.monitor.updateState({ 
        lastError: error.message,
        isAuthenticated: false 
      });
      this.events.onError(error);
    });

    this.rcon.on('close', () => {
      this.monitor.updateState({ isAuthenticated: false });
      this.events.onDisconnect();
    });
  }

  async sendCommand(command: string): Promise<string> {
    if (!this.rcon?.isConnected()) {
      throw new Error('Not connected to server');
    }

    try {
      const response = await this.rcon.send(command);
      this.monitor.logCommand(command, response);
      return response;
    } catch (error) {
      this.monitor.logError(error instanceof Error ? error : new Error('Command failed'));
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.rcon) {
      try {
        await this.rcon.disconnect();
      } finally {
        this.rcon = null;
        this.monitor.updateState({
          isAuthenticated: false,
          isConnecting: false,
          reconnectAttempts: 0
        });
      }
    }
  }
}
