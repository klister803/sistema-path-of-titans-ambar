import { RconBridge } from './RconBridge';
import { RconResponse } from '../types/rcon';
import { retryWithBackoff } from './utils/retry';

export class RconService {
  private static rconBridge: RconBridge | null = null;
  private static reconnectAttempts = 0;
  private static readonly MAX_RECONNECTS = 3;

  private static getBridge(): RconBridge {
    if (!this.rconBridge) {
      this.rconBridge = RconBridge.getInstance();
    }
    return this.rconBridge;
  }

  static async sendCommand(command: string): Promise<RconResponse> {
    try {
      const response = await retryWithBackoff(
        async () => {
          const bridge = this.getBridge();
          return await bridge.sendCommand(command);
        },
        {
          maxAttempts: this.MAX_RECONNECTS,
          onError: async (error) => {
            console.error('RCON error:', error);
            this.reconnectAttempts++;
          }
        }
      );

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Falha ao comunicar com o servidor',
        timestamp: new Date().toISOString()
      };
    }
  }

  static async sendVerificationCode(username: string, code: string): Promise<void> {
    const command = `whisper ${username} Seu código de verificação é: ${code}`;
    const response = await this.sendCommand(command);
    if (!response.success) {
      throw new Error(response.error || 'Falha ao enviar código de verificação');
    }
  }

  static async checkUserExists(username: string): Promise<boolean> {
    try {
      const command = `listplayer ${username}`;
      const response = await this.sendCommand(command);
      if (!response.success) return false;
      return !response.data?.includes('not found');
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      return false;
    }
  }

  static generateVerificationCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  static async sendWhisper(username: string, message: string): Promise<RconResponse> {
    const command = `whisper ${username} ${message}`;
    return await this.sendCommand(command);
  }
}
