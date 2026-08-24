import React from 'react';
import { TOPICS_DATA } from '../../services/mockDataService';
import { Hash, TrendingUp, AlertOctagon } from 'lucide-react';

interface TopicCloudProps {
  onSelectTopic?: (topic: string) => void;
}

export const TopicCloud: React.FC<TopicCloudProps> = ({ onSelectTopic }) => {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold font-heading text-white">
            Nuvem de Tópicos & Termos Sensíveis
          </h3>
          <p className="text-xs text-slate-400">
            Assuntos mais comentados e termos com risco de crise
          </p>
        </div>
        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
          Atualizado há 2 min
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {TOPICS_DATA.map((topic) => {
          const isCritical = topic.sentiment === 'critical';
          const isNegative = topic.sentiment === 'negative';
          const isPositive = topic.sentiment === 'positive';

          let badgeStyle = 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500';
          if (isCritical) {
            badgeStyle = 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25';
          } else if (isNegative) {
            badgeStyle = 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25';
          } else if (isPositive) {
            badgeStyle = 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/25';
          }

          return (
            <button
              key={topic.name}
              onClick={() => onSelectTopic?.(topic.name)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all hover:scale-105 active:scale-95 ${badgeStyle}`}
            >
              {isCritical ? (
                <AlertOctagon className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
              ) : (
                <Hash className="h-3.5 w-3.5 opacity-60" />
              )}
              
              <span className="font-semibold">{topic.name}</span>
              
              <span className="rounded-md bg-slate-950/60 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                {topic.count}
              </span>

              <span className={`text-[10px] font-bold ${
                isCritical ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {topic.growth}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
