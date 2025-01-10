type NivelLog = 'debug' | 'info' | 'warn' | 'error';

interface EntradaLog {
  nivel: NivelLog;
  mensagem: string;
  timestamp: string;
  detalhes?: any;
}

export class RconLogger {
  private static logs: EntradaLog[] = [];
  private static maxLogs = 100;

  static log(nivel: NivelLog, mensagem: string, detalhes?: any): void {
    const entrada: EntradaLog = {
      nivel,
      mensagem,
      timestamp: new Date().toISOString(),
      detalhes
    };

    console[nivel](mensagem, detalhes);
    this.logs.unshift(entrada);

    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }

  static debug(mensagem: string, detalhes?: any): void {
    this.log('debug', mensagem, detalhes);
  }

  static info(mensagem: string, detalhes?: any): void {
    this.log('info', mensagem, detalhes);
  }

  static warn(mensagem: string, detalhes?: any): void {
    this.log('warn', mensagem, detalhes);
  }

  static error(mensagem: string, detalhes?: any): void {
    this.log('error', mensagem, detalhes);
  }

  static obterLogs(): EntradaLog[] {
    return [...this.logs];
  }

  static limpar(): void {
    this.logs = [];
  }
}
