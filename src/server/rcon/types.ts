export interface Player {
  name: string;
  info: string;
}

export interface PlayerList {
  count: number;
  players: Player[];
  timestamp: string;
}

export interface RconCommandResult {
  success: boolean;
  data?: string;
  error?: string;
  timestamp: string;
}
