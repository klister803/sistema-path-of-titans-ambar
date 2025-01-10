import React from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import { RconCommandResponse } from '../../../lib/api/rcon';

interface RconCommandLogProps {
  commands: RconCommandResponse[];
  debugMode: boolean;
}

export const RconCommandLog: React.FC<RconCommandLogProps> = ({ commands, debugMode }) => {
  return (
    <div className="space-y-2 font-mono">
      {commands.map((cmd, index) => (
        <div key={index} className="border-b border-[rgba(var(--color-gold),0.1)] pb-2">
          <div className="flex items-start gap-2">
            <span className="text-[rgba(var(--color-gold),0.5)] whitespace-nowrap">
              {cmd.timestamp ? new Date(cmd.timestamp).toLocaleTimeString() : 'N/A'}
            </span>
            <div className="flex-1">
              <div className="text-[rgb(var(--color-gold))]">
                $ {cmd.command}
              </div>
              <div className="mt-1 text-[rgba(var(--color-gold),0.8)]">
                {cmd.response}
              </div>
              {cmd.error && debugMode && (
                <div className="mt-1 flex items-center gap-1 text-red-500">
                  <AlertTriangle size={16} />
                  <span>{cmd.error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {commands.length === 0 && (
        <div className="text-center text-[rgba(var(--color-gold),0.5)] py-4">
          Nenhum comando executado ainda
        </div>
      )}
    </div>
  );
};
