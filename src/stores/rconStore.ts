import { create } from 'zustand';
import { rconApi } from '../lib/api/rcon';
import type { RconCommandResponse, ServerStatus } from '../lib/api/rcon';

interface RconState {
  commandHistory: RconCommandResponse[];
  serverStatus: ServerStatus | null;
  debugMode: boolean;
  executeCommand: (command: string) => Promise<void>;
  getServerStatus: () => Promise<void>;
  toggleDebugMode: () => void;
  clearHistory: () => void;
  lastStatusFetch: number;
}

const fetchInterval = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useRconStore = create<RconState>()(
    (set, get) => ({
      commandHistory: [],
      serverStatus: null,
      debugMode: true,
      lastStatusFetch: 0,

      executeCommand: async (command: string) => {
        try {
          const response = await rconApi.executeCommand(command);
          
          set(state => ({
            commandHistory: [...state.commandHistory, response]
          }));
        } catch (err) {
          console.error('Erro ao executar comando:', err);
          const errorResponse: RconCommandResponse = {
            success: false,
            command,
            response: err instanceof Error ? err.message : 'Erro desconhecido',
            timestamp: new Date().toISOString(),
            error: err instanceof Error ? err.message : 'Erro desconhecido'
          };
          
          set(state => ({
            commandHistory: [...state.commandHistory, errorResponse]
          }));
          
          throw err;
        }
      },

      getServerStatus: async () => {
        const now = Date.now();
        if (now - get().lastStatusFetch < fetchInterval) {
          return; // Skip if fetched recently
        }

        try {
          const response = await rconApi.executeCommand('ListPlayers');
          const status = get().serverStatus || { status: 'offline', players: 0, max_players: 0, uptime: '0' };
          
          let players = 0;
          if (response.success && response.response) {
            const match = response.response.match(/Total Players: (\d+)/);
            if (match && match[1]) {
              players = parseInt(match[1], 10);
            }
          }
          
          set({ serverStatus: { ...status, players }, lastStatusFetch: now });
        } catch (err) {
          console.error('Erro ao obter status do servidor:', err);
          throw err;
        }
      },

      toggleDebugMode: () => set(state => ({ debugMode: !state.debugMode })),
      clearHistory: () => set({ commandHistory: [] })
    })
);
