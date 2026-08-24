import React from 'react';
import { BarChart3, TrendingUp, Award, Zap, ArrowUpRight, Shield } from 'lucide-react';

export const BenchmarkView: React.FC = () => {
  const competitors = [
    { name: 'Sentinela Brand Tech (Sua Marca)', score: 84, sentimentPos: 62, volume: '14.2k', reach: '2.85M', status: 'Líder em Velocidade de IA', isCurrent: true },
    { name: 'Concorrente Alpha', score: 76, sentimentPos: 54, volume: '18.9k', reach: '3.10M', status: 'Alto Volume', isCurrent: false },
    { name: 'Concorrente Beta', score: 71, sentimentPos: 48, volume: '9.4k', reach: '1.40M', status: 'Estável', isCurrent: false },
    { name: 'Concorrente Gamma', score: 65, sentimentPos: 41, volume: '6.1k', reach: '950k', status: 'Queda em Reputação', isCurrent: false },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            Benchmarking de Concorrentes & Share of Voice
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare o volume de menções, índice de reputação e sentimento da sua marca frente aos principais concorrentes do segmento.
          </p>
        </div>
      </div>

      {/* Tabela Comparativa */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Marca / Player</th>
                <th className="px-6 py-4">Health Score</th>
                <th className="px-6 py-4">% Sentimento Positivo</th>
                <th className="px-6 py-4">Volume (24h)</th>
                <th className="px-6 py-4">Alcance Estimado</th>
                <th className="px-6 py-4">Destaque de IA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {competitors.map((comp) => (
                <tr 
                  key={comp.name} 
                  className={`transition-colors ${
                    comp.isCurrent ? 'bg-indigo-950/20 font-semibold' : 'hover:bg-slate-900/40'
                  }`}
                >
                  <td className="px-6 py-4 text-white flex items-center gap-2">
                    {comp.isCurrent && <Award className="h-4 w-4 text-indigo-400" />}
                    <span>{comp.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-emerald-400">{comp.score}</span> / 100
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{comp.sentimentPos}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${comp.sentimentPos}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-200">{comp.volume}</td>
                  <td className="px-6 py-4 text-slate-200">{comp.reach}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 text-[11px] font-semibold text-indigo-300">
                      {comp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
