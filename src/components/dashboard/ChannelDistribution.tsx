import React from 'react';
import { 
  Instagram, 
  Video, 
  Twitter, 
  Youtube, 
  Newspaper, 
  MessageSquareShare 
} from 'lucide-react';

export const ChannelDistribution: React.FC = () => {
  const channels = [
    { name: 'Instagram', icon: Instagram, count: 4820, percent: 34, color: 'text-pink-400', barBg: 'bg-pink-500' },
    { name: 'TikTok', icon: Video, count: 3560, percent: 25, color: 'text-cyan-400', barBg: 'bg-cyan-500' },
    { name: 'X / Twitter', icon: Twitter, count: 2840, percent: 20, color: 'text-sky-400', barBg: 'bg-sky-500' },
    { name: 'YouTube', icon: Youtube, count: 1710, percent: 12, color: 'text-red-400', barBg: 'bg-red-500' },
    { name: 'Portais & Notícias', icon: Newspaper, count: 850, percent: 6, color: 'text-emerald-400', barBg: 'bg-emerald-500' },
    { name: 'Reddit & Fóruns', icon: MessageSquareShare, count: 500, percent: 3, color: 'text-orange-400', barBg: 'bg-orange-500' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold font-heading text-white">
            Distribuição Multicanal
          </h3>
          <p className="text-xs text-slate-400">
            Volume de escuta ativa segmentado por rede social
          </p>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          6 Fontes Ativas
        </span>
      </div>

      <div className="space-y-3.5">
        {channels.map((ch) => {
          const Icon = ch.icon;

          return (
            <div key={ch.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${ch.color}`} />
                  <span className="font-medium text-slate-200">{ch.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{ch.count.toLocaleString()} posts</span>
                  <span className="font-bold text-white w-8 text-right">{ch.percent}%</span>
                </div>
              </div>

              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${ch.barBg} transition-all duration-700`}
                  style={{ width: `${ch.percent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
