import React from 'react';
import { 
  Radar, 
  MessageSquareText, 
  ShieldAlert, 
  Sparkles, 
  BellRing, 
  BarChart3,
  Sliders,
  Flame,
  User,
  Users
} from 'lucide-react';

export type NavTab = 'dashboard' | 'listening' | 'crisis' | 'insights' | 'benchmarks' | 'rules' | 'user-profile' | 'user-management';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeCrisisCount: number;
  totalMentionsCount: number;
  isAdmin?: boolean;
  userPlan?: string;
  onOpenPlans?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeCrisisCount,
  totalMentionsCount,
  isAdmin = true,
  userPlan = 'Enterprise',
  onOpenPlans
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Painel Radar',
      icon: Radar,
      badge: 'Ao Vivo',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'listening' as NavTab,
      label: 'Social Listening',
      icon: MessageSquareText,
      badge: totalMentionsCount.toString(),
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
    },
    {
      id: 'crisis' as NavTab,
      label: 'Gestão de Crises',
      icon: ShieldAlert,
      badge: activeCrisisCount > 0 ? `${activeCrisisCount} Alertas` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
    },
    {
      id: 'insights' as NavTab,
      label: 'AI Insights & Relatórios',
      icon: Sparkles,
      badge: 'IA',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      id: 'rules' as NavTab,
      label: 'Gatilhos & Alertas',
      icon: BellRing,
    },
    {
      id: 'benchmarks' as NavTab,
      label: 'Concorrentes & Bench',
      icon: BarChart3,
    },
    {
      id: 'user-profile' as NavTab,
      label: 'Meu Perfil',
      icon: User,
    },
    ...(isAdmin ? [{
      id: 'user-management' as NavTab,
      label: 'Gestão de Usuários',
      icon: Users,
      badge: 'Admin',
      badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
    }] : [])
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-slate-800/80 bg-slate-950/40 p-4">
      <div className="space-y-6">
        
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Navegação Principal
          </p>
          <nav className="mt-2 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 border border-indigo-500/40 text-white shadow-sm shadow-indigo-600/10'
                      : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Threat Level Card */}
        <div className="rounded-xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-rose-400" />
              Índice de Risco
            </span>
            <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
              MODERADO
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
            <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-2 rounded-full w-[42%]"></div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            IA detectou 1 tópico viral com potencial de crise nas últimas 2h.
          </p>
        </div>

        {/* Subscription Plan Card */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-900/80 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Plano de Acesso
            </span>
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30 capitalize">
              {userPlan}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            12 serviços e radar preditivo ativo.
          </p>

          <button
            type="button"
            onClick={onOpenPlans}
            className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Ver Catálogo de Planos</span>
          </button>
        </div>

      </div>
    </aside>
  );
};
