import React from 'react';
import { Smile, Meh, Frown, AlertTriangle } from 'lucide-react';
import { BrandOverview } from '../../types/monitor';

interface SentimentGaugeProps {
  sentiment: BrandOverview['sentimentSplit'];
}

export const SentimentGauge: React.FC<SentimentGaugeProps> = ({ sentiment }) => {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold font-heading text-white">
            Termômetro de Sentimento
          </h3>
          <p className="text-xs text-slate-400">
            Classificação automática via IA em tempo real
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
          62% Positivo
        </span>
      </div>

      {/* Progress Bar Split */}
      <div className="h-4 w-full rounded-full bg-slate-800 flex overflow-hidden p-0.5 gap-0.5">
        <div 
          className="h-full rounded-l-full bg-emerald-500 transition-all duration-700 hover:opacity-90"
          style={{ width: `${sentiment.positive}%` }}
          title={`Positivo: ${sentiment.positive}%`}
        ></div>
        <div 
          className="h-full bg-slate-400 transition-all duration-700 hover:opacity-90"
          style={{ width: `${sentiment.neutral}%` }}
          title={`Neutro: ${sentiment.neutral}%`}
        ></div>
        <div 
          className="h-full bg-amber-500 transition-all duration-700 hover:opacity-90"
          style={{ width: `${sentiment.negative}%` }}
          title={`Negativo: ${sentiment.negative}%`}
        ></div>
        <div 
          className="h-full rounded-r-full bg-rose-600 transition-all duration-700 hover:opacity-90"
          style={{ width: `${sentiment.critical}%` }}
          title={`Crítico: ${sentiment.critical}%`}
        ></div>
      </div>

      {/* Breakdown Grid */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Positivo */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-3 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
            <Smile className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400">Positivo</span>
            <p className="text-lg font-bold text-white">{sentiment.positive}%</p>
          </div>
        </div>

        {/* Neutro */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-3 flex items-center gap-3">
          <div className="rounded-lg bg-slate-500/10 p-2 text-slate-300 border border-slate-500/20">
            <Meh className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400">Neutro</span>
            <p className="text-lg font-bold text-white">{sentiment.neutral}%</p>
          </div>
        </div>

        {/* Negativo */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-3 flex items-center gap-3">
          <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20">
            <Frown className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400">Negativo</span>
            <p className="text-lg font-bold text-white">{sentiment.negative}%</p>
          </div>
        </div>

        {/* Crítico / Risco */}
        <div className="rounded-xl bg-slate-900/80 border border-rose-500/20 p-3 flex items-center gap-3">
          <div className="rounded-lg bg-rose-500/10 p-2 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400">Crítico (Crise)</span>
            <p className="text-lg font-bold text-rose-400">{sentiment.critical}%</p>
          </div>
        </div>

      </div>
    </div>
  );
};
