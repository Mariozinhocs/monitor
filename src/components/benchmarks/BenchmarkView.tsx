import React from 'react';
import { BarChart3, Award } from 'lucide-react';

interface BenchmarkViewProps {
  brandName?: string;
  competitorNames?: string[];
}

export const BenchmarkView: React.FC<BenchmarkViewProps> = ({ 
  brandName = 'Centro de Cooperação da Cidade',
  competitorNames = ['Centro de Operações Rio (COR)', 'CET Trânsito', 'Central Integrada 190']
}) => {
  const currentBrandEntry = {
    name: `${brandName} (Alvo Atual)`,
    score: 86,
    sentimentPos: 64,
    volume: '16.4k',
    reach: '3.20M',
    status: 'Líder em Velocidade de Resposta',
    isCurrent: true
  };

  const defaultCompetitorData = [
    { score: 78, sentimentPos: 56, volume: '14.1k', reach: '2.40M', status: 'Alto Volume' },
    { score: 72, sentimentPos: 49, volume: '9.8k', reach: '1.60M', status: 'Estável' },
    { score: 68, sentimentPos: 43, volume: '6.5k', reach: '920k', status: 'Atenção em Ocorrências' },
  ];

  const competitors = [
    currentBrandEntry,
    ...competitorNames.map((name, idx) => {
      const sample = defaultCompetitorData[idx % defaultCompetitorData.length];
      return {
        name,
        score: sample.score,
        sentimentPos: sample.sentimentPos,
        volume: sample.volume,
        reach: sample.reach,
        status: sample.status,
        isCurrent: false
      };
    })
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            Benchmarking de Concorrentes / Órgãos & Share of Voice
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare o volume de menções, índice de reputação e sentimento de {brandName} frente aos principais pares e referências do setor.
          </p>
        </div>
      </div>

      {/* Tabela Comparativa */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Marca / Órgão</th>
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
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${comp.sentimentPos}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {comp.volume}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {comp.reach}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                      comp.isCurrent 
                        ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
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
