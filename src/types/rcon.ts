export interface RconResponse {
  success: boolean;
  data?: string;
  error?: string;
  timestamp: string;
}

export interface RconConfig {
  host: string;
  port: number;
  password: string;
  timeout?: number;
  maxReconnects?: number;
}

export interface RconCommand {
  command: string;
  response: string | null;
  error: string | null;
  success: boolean;
  timestamp: string;
}
