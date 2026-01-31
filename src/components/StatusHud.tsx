import React from 'react';
import { GameState } from '../types';
import { DollarSign, Users, Heart, Brain } from 'lucide-react';

export const StatusHud = ({ stats }: { stats: GameState['stats'] }) => {
  return (
    <div className="flex justify-between items-center w-full px-8 py-4 bg-black/50 backdrop-blur-md border-t border-slate-800">
      <StatItem icon={<DollarSign size={18} />} value={stats.wealth} label="Wealth" color="text-yellow-500" />
      <StatItem icon={<Users size={18} />} value={stats.popularity} label="Popularity" color="text-blue-500" />
      <StatItem icon={<Heart size={18} />} value={stats.health} label="Health" color="text-red-500" />
      <StatItem icon={<Brain size={18} />} value={stats.sanity} label="Sanity" color="text-purple-500" />
    </div>
  );
};

const StatItem = ({ icon, value, label, color }: { icon: React.ReactNode, value: number, label: string, color: string }) => (
  <div className="flex flex-col items-center gap-1" title={label}>
    <div className={`${color}`}>{icon}</div>
    <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color.replace('text-', 'bg-')}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  </div>
);
