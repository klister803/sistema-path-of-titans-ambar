import React, { useEffect, useState } from 'react';
import { Activity, Users, Clock } from 'lucide-react';
import { useRconStore } from '../../../stores/rconStore';
import { ServerStatus } from '../../../lib/api/rcon';

export const ServerStatusDisplay: React.FC = () => {
  const { getServerStatus, serverStatus } = useRconStore();
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getServerStatus()
      .then(data => {
        setStatus(data);
        setError(null);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to fetch server status');
      })
      .finally(() => setLoading(false));
  }, [getServerStatus]);

  if (loading) {
    return <div className="text-center text-[rgb(var(--color-gold))]">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!status) return null;

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-[rgba(var(--color-gold),0.1)] p-4 rounded-lg">
        <div className="flex items-center gap-2 text-[rgb(var(--color-gold))]">
          <Activity size={20} />
          <span>Status</span>
        </div>
        <div className="mt-2 font-bold text-[rgb(var(--color-gold))]">
          {status.status}
        </div>
      </div>

      <div className="bg-[rgba(var(--color-gold),0.1)] p-4 rounded-lg">
        <div className="flex items-center gap-2 text-[rgb(var(--color-gold))]">
          <Users size={20} />
          <span>Jogadores</span>
        </div>
        <div className="mt-2 font-bold text-[rgb(var(--color-gold))]">
          {status.players}/{status.max_players}
        </div>
      </div>

      <div className="bg-[rgba(var(--color-gold),0.1)] p-4 rounded-lg">
        <div className="flex items-center gap-2 text-[rgb(var(--color-gold))]">
          <Clock size={20} />
          <span>Uptime</span>
        </div>
        <div className="mt-2 font-bold text-[rgb(var(--color-gold))]">
          {status.uptime}
        </div>
      </div>
    </div>
  );
};
