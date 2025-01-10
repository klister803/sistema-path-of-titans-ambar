import React, { useState, useEffect } from 'react';
import { useRconStore } from '../../stores/rconStore';
import { CommandHistory } from './CommandHistory';
import { CommandInput } from './CommandInput';
import { ServerStatus } from './ServerStatus';

export const RconConsole: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { executeCommand, commandHistory } = useRconStore();

  const handleCommand = async (command: string) => {
    setLoading(true);
    try {
      await executeCommand(command);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ServerStatus />
      <CommandInput 
        onSubmit={handleCommand}
        disabled={loading}
      />
      <CommandHistory commands={commandHistory} />
    </div>
  );
};
