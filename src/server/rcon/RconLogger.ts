type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  details?: any;
}

export class RconLogger {
  private static logs: LogEntry[] = [];
  private static maxLogs = 1000;

  static log(level: LogLevel, message: string, details?: any): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      details
    };

    console[level](message, details);
    this.logs.unshift(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }

  static debug(message: string, details?: any): void {
    this.log('debug', message, details);
  }

  static info(message: string, details?: any): void {
    this.log('info', message, details);
  }

  static warn(message: string, details?: any): void {
    this.log('warn', message, details);
  }

  static error(message: string, details?: any): void {
    this.log('error', message, details);
  }

  static getLogs(): LogEntry[] {
    return [...this.logs];
  }

  static clear(): void {
    this.logs = [];
  }
}
