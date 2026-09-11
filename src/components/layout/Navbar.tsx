import React from 'react';
import { Radio, Sparkles, Bell, RefreshCw, ShieldAlert, Download, Layers, User, LogOut, UserCheck, Target } from 'lucide-react';
import { BrandOverview } from '../../types/monitor';
import { UserProfile } from '../../types/user';

interface NavbarProps {
  brand: BrandOverview;
  activeAlertCount: number;
  isScanning: boolean;
  currentUser?: UserProfile | null;
  onTriggerScan: () => void;
  onOpenAISummary: () => void;
  onOpenCrisisCenter: () => void;
  onOpenProfile?: () => void;
  onOpenLogin?: () => void;
  onNavigateTab?: (tab: string) => void;
  onLogout?: () => void;
  onOpenMonitorSetup: () => void;
  onOpenPlans?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brand,
  activeAlertCount,
  isScanning,
  currentUser,
  onTriggerScan,
  onOpenAISummary,
  onOpenCrisisCenter,
  onOpenProfile,
  onOpenLogin,
  onNavigateTab,
  onLogout,
  onOpenMonitorSetup,
  onOpenPlans
}) => {
  const currentPlanName = currentUser?.plan || 'Enterprise';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Radio className="h-5 w-5 text-indigo-400 animate-pulse" />
            </div>
            {/* Live Indicator Dot */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-heading tracking-tight text-white flex items-center gap-1.5">
                Sentinela<span className="text-indigo-400">.ai</span>
              </span>
              <button
                type="button"
                onClick={onOpenPlans}
                className="rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-300 uppercase tracking-wider transition-all hover:scale-105"
                title="Clique para ver planos e catálogo de serviços"
              >
                {currentPlanName}
              </button>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Vigilância Ativa, Social Listening & Gestão de Crises
            </p>
          </div>
        </div>

        {/* Monitoring Target & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Brand Switcher / Target Button */}
          <button
            onClick={onOpenMonitorSetup}
            className="flex items-center gap-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:text-white transition-all shadow-sm group"
            title="Definir marca, palavras-chave e termos de crise para monitorar"
          >
            <Target className="h-3.5 w-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-400 font-normal hidden sm:inline">O que Monitorar:</span>
            <span className="font-bold text-white">{brand.brandName}</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-[10px] text-indigo-300 uppercase font-mono font-bold ml-1">Configurar</span>
          </button>

          {/* Real-time Radar Scan Trigger */}
          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all ${
              isScanning
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
            title="Executar varredura em tempo real em todas as redes"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isScanning ? 'Varrendo Redes...' : 'Radar Ao Vivo'}</span>
          </button>

          {/* AI Insights Button */}
          <button
            onClick={onOpenAISummary}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
            <span className="hidden sm:inline">AI Insights</span>
          </button>

          {/* Crisis Alerts Quick Button */}
          <button
            onClick={onOpenCrisisCenter}
            className={`relative flex items-center justify-center rounded-lg p-2 border transition-all ${
              activeAlertCount > 0
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 hover:bg-rose-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Central de Gestão de Crises"
          >
            <ShieldAlert className="h-4 w-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm">
                {activeAlertCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-xs font-medium text-slate-200"
                title="Ver Meu Perfil"
              >
                <div className="h-7 w-7 rounded-lg overflow-hidden bg-indigo-600 border border-indigo-400/30 flex items-center justify-center font-bold text-white text-[11px]">
                  {currentUser.avatar_url ? (
                    <img src={currentUser.avatar_url} alt={currentUser.username} className="h-full w-full object-cover" />
                  ) : (
                    currentUser.username.substring(0, 2).toUpperCase()
                  )}
                </div>
                <span className="hidden md:inline font-bold text-white">@{currentUser.username}</span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-rose-400 transition-all"
                title="Sair (Logout)"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md transition-all"
            >
              <User className="h-3.5 w-3.5" />
              <span>Entrar</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};

