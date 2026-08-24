import React from 'react';
import { 
  TrendingUp, 
  ShieldAlert, 
  Users, 
  MessageSquare, 
  Award, 
  ArrowUpRight,
  Radio,
  Flame
} from 'lucide-react';
import { BrandOverview } from '../../types/monitor';

interface RadarOverviewProps {
  brand: BrandOverview;
  isScanning: boolean;
}

export const RadarOverview: React.FC<RadarOverviewProps> = ({ brand, isScanning }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Score de Reputação Sentinela */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Health Score da Marca
          </span>
          <div className="rounded-xl bg-emerald-500/10 p-2 border border-emerald-500/20 text-emerald-400">
            <Award className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-heading text-white">
            {brand.reputationScore}
          </span>
          <span className="text-sm font-semibold text-slate-400">/100</span>
          <span className="ml-auto inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <ArrowUpRight className="h-3 w-3" /> +3.2 pts
          </span>
        </div>

        <div className="mt-3">
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-1000"
              style={{ width: `${brand.reputationScore}%` }}
            ></div>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Status: <strong className="text-emerald-400 font-semibold">Excelente Reputação</strong>
          </p>
        </div>
      </div>

      {/* 2. Volume Total de Menções */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menções 24h
          </span>
          <div className="rounded-xl bg-indigo-500/10 p-2 border border-indigo-500/20 text-indigo-400">
            <MessageSquare className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-heading text-white">
            {brand.totalMentions.toLocaleString()}
          </span>
          <span className="ml-auto inline-flex items-center gap-0.5 text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
            <TrendingUp className="h-3 w-3" /> +{brand.growthRate24h}%
          </span>
        </div>

        <p className="mt-4 text-[11px] text-slate-400 flex items-center gap-1.5">
          <Radio className={`h-3 w-3 ${isScanning ? 'text-indigo-400 animate-spin' : 'text-slate-500'}`} />
          {isScanning ? 'Capturando novos posts...' : 'Indexando 6 plataformas ao vivo'}
        </p>
      </div>

      {/* 3. Alertas Críticos de Risco */}
      <div className={`glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden ${
        brand.activeCrisisCount > 0 ? 'border-rose-500/30' : ''
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Alertas de Crise
          </span>
          <div className="rounded-xl bg-rose-500/10 p-2 border border-rose-500/20 text-rose-400">
            <ShieldAlert className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-heading text-rose-400">
            {brand.activeCrisisCount}
          </span>
          <span className="text-xs font-medium text-slate-400">Ativos agora</span>
          {brand.activeCrisisCount > 0 && (
            <span className="ml-auto inline-flex items-center gap-0.5 text-xs font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full animate-pulse">
              <Flame className="h-3 w-3" /> Atenção
            </span>
          )}
        </div>

        <p className="mt-4 text-[11px] text-slate-400">
          1 tópico em alta no TikTok & 1 no Twitter.
        </p>
      </div>

      {/* 4. Alcance Estimado */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Alcance Potencial (Reach)
          </span>
          <div className="rounded-xl bg-cyan-500/10 p-2 border border-cyan-500/20 text-cyan-400">
            <Users className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-heading text-white">
            {(brand.estimatedReach / 1000000).toFixed(1)}M
          </span>
          <span className="text-xs font-medium text-slate-400">Usuários impactados</span>
        </div>

        <p className="mt-4 text-[11px] text-slate-400">
          Crescimento de +14.2% em engajamento orgânico.
        </p>
      </div>

    </div>
  );
};
