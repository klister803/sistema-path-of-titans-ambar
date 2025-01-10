import React, { useState, useRef, useEffect } from 'react';
import { Terminal, AlertCircle } from 'lucide-react';
import { Card } from '../../ui/Card';
import { RconCommandLog } from './RconCommandLog';
import { RconInput } from './RconInput';
import { ServerStatusDisplay } from './ServerStatusDisplay';
import { useRconStore } from '../../../stores/rconStore';

export const RconConsole: React.FC = () => {
  const { executeCommand, commandHistory, debugMode, toggleDebugMode, getServerStatus } = useRconStore();
  const [command, setCommand] = useState('');
  const [error, setError] = useState<string | null>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Atualiza o status do servidor a cada 30 segundos
    getServerStatus();
    const interval = setInterval(getServerStatus, 30000);
    return () => clearInterval(interval);
  }, [getServerStatus]);

  const handleExecuteCommand = async () => {
    if (!command.trim()) return;
    
    try {
      await executeCommand(command);
      setCommand('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao executar comando');
    }
  };

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Terminal className="text-[rgb(var(--color-gold))]" size={24} />
          <h2 className="text-xl font-bold text-[rgb(var(--color-gold))]">
            Console RCON
          </h2>
        </div>

        <button
          onClick={toggleDebugMode}
          className={`px-4 py-2 rounded-lg transition-colors ${
            debugMode
              ? 'bg-[rgba(var(--color-gold),0.2)] text-[rgb(var(--color-gold))]'
              : 'bg-[rgba(var(--color-gold),0.1)] text-[rgba(var(--color-gold),0.7)]'
          }`}
        >
          Modo Debug
        </button>
      </div>

      <ServerStatusDisplay />

      <div className="bg-[rgb(var(--color-obsidian))] rounded-lg border border-[rgba(var(--color-gold),0.2)] p-4 mb-4 h-96 overflow-y-auto">
        <RconCommandLog commands={commandHistory} debugMode={debugMode} />
        <div ref={consoleEndRef} />
      </div>

      <RconInput
        value={command}
        onChange={setCommand}
        onExecute={handleExecuteCommand}
        error={error}
      />

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-500">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </Card>
  );
};
