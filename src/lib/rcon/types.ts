export interface RconConnectionState {
  isConnecting: boolean;
  isAuthenticated: boolean;
  lastError: string | null;
  reconnectAttempts: number;
}

export interface RconEvents {
  onError: (error: Error) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}
