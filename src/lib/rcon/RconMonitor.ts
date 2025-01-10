import { EventEmitter } from '../utils/EventEmitter';
import { RconLogger } from './RconLogger';
import type { RconConnectionState } from './types';

export class RconMonitor extends EventEmitter {
  private static instance: RconMonitor;
  private connectionState: RconConnectionState = {
    isConnecting: false,
    isAuthenticated: false,
    lastError: null,
    reconnectAttempts: 0
  };

  private constructor() {
    super();
  }

  static getInstance(): RconMonitor {
    if (!RconMonitor.instance) {
      RconMonitor.instance = new RconMonitor();
    }
    return RconMonitor.instance;
  }

  updateState(newState: Partial<RconConnectionState>): void {
    this.connectionState = { ...this.connectionState, ...newState };
    this.emit('stateChange', this.connectionState);
    
    RconLogger.info('RCON state updated', this.connectionState);
  }

  getState(): RconConnectionState {
    return { ...this.connectionState };
  }

  logCommand(command: string, response: any): void {
    RconLogger.debug('RCON command executed', { command, response });
    this.emit('command', { command, response });
  }

  logError(error: Error): void {
    RconLogger.error('RCON error occurred', error);
    this.emit('error', error);
  }
}
