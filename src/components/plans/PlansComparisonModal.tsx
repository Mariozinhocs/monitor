import React, { useState } from 'react';
import { 
  Check, 
  X as CloseIcon, 
  Sparkles, 
  ShieldCheck, 
  Crown, 
  Layers, 
  ArrowRight, 
  Zap,
  Building2,
  Lock,
  ExternalLink,
  HelpCircle,
  BarChart3,
  Radio,
  BellRing,
  Download,
  Users
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, SENTINELA_SERVICES_CATALOG, PlanTier, SubscriptionPlan } from '../../types/plans';
import { normalizePlanTier } from '../../services/planPermissionsService';

interface PlansComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  onSelectUpgrade?: (plan: SubscriptionPlan) => void;
}

export const PlansComparisonModal: React.FC<PlansComparisonModalProps> = ({
  isOpen,
  onClose,
  currentPlan = 'enterprise',
  onSelectUpgrade,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [activeTab, setActiveTab] = useState<'plans' | 'services'>('plans');
  
  const normalizedCurrent = normalizePlanTier(currentPlan);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header da Modal */}
        <div className="px-6 py-5 border-b border-slate-800/80 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
                  Planos de Assinatura & Catálogo de Serviços
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  12 Serviços Ativos
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Escale a inteligência de monitoramento e gestão de crises da sua marca conforme sua necessidade.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Tab Switcher */}
            <div className="flex rounded-xl bg-slate-800/90 p-1 border border-slate-700/60 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('plans')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'plans'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Planos & Preços
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('services')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'services'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Catálogo (12 Serviços)
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all ml-1"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: Visualização de Planos */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              
              {/* Seletor Mensal / Anual */}
              <div className="flex items-center justify-center gap-3">
                <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
                  Faturamento Mensal
                </span>
                <button
                  type="button"
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  className="relative w-12 h-6 rounded-full bg-slate-800 border border-slate-700 transition-colors p-0.5"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-transform ${
                      billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
                    Anual
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    20% OFF
                  </span>
                </div>
              </div>

              {/* Grid dos Planos */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const isCurrent = normalizedCurrent === plan.id;
                  const price = billingCycle === 'annual' ? plan.priceAnnualMonthly : plan.priceMonthly;

                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                        plan.isFeatured
                          ? 'bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 border-indigo-500/50 shadow-xl shadow-indigo-950/40'
                          : isCurrent
                          ? 'bg-slate-900/90 border-emerald-500/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Badge superior */}
                      {plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-bold text-white shadow-md">
                          {plan.badge}
                        </div>
                      )}

                      {/* Header do Card */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-white font-heading">
                            {plan.name}
                          </h3>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Seu Plano
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed min-h-[32px]">
                          {plan.tagline}
                        </p>

                        <div className="pt-2 border-t border-slate-800/80">
                          {plan.isCustomPrice ? (
                            <div className="py-1">
                              <span className="text-xl font-extrabold text-white">Sob Medida</span>
                              <p className="text-[10px] text-slate-400">Contratos institucionais</p>
                            </div>
                          ) : (
                            <div className="flex items-baseline gap-1">
                              <span className="text-xs text-slate-400">R$</span>
                              <span className="text-2xl font-black text-white">{price}</span>
                              <span className="text-[10px] text-slate-400">{plan.billingPeriod}</span>
                            </div>
                          )}
                        </div>

                        {/* Lista de Recursos */}
                        <div className="space-y-2 pt-3 border-t border-slate-800/80">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Recursos Inclusos:
                          </p>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {plan.highlightedFeatures.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="text-[11px] leading-snug">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Botão de Ação */}
                      <div className="pt-5 mt-4 border-t border-slate-800/80">
                        {isCurrent ? (
                          <button
                            type="button"
                            disabled
                            className="w-full py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 cursor-default flex items-center justify-center gap-1.5"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Plano Atual</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSelectUpgrade?.(plan)}
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${
                              plan.isFeatured
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
                                : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white'
                            }`}
                          >
                            <span>{plan.isCustomPrice ? 'Falar com Consultor' : 'Fazer Upgrade'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: Catálogo Completo de Serviços (S01 a S12) */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    O ecossistema <strong>Sentinela.ai</strong> opera com 12 módulos integrados de vigilância, IA e mitigação de riscos.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {SENTINELA_SERVICES_CATALOG.map((service) => {
                  return (
                    <div
                      key={service.id}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                            {service.id}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            {service.categoryLabel}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {service.name}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {service.detailedDescription}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Mínimo requerido:</span>
                        <span className="font-semibold text-slate-300 capitalize">
                          {service.minPlan === 'starter' ? 'Plano Starter' : service.minPlan === 'pro' ? 'Plano Professional' : 'Plano Enterprise'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cobrança segura integrada via <strong>Mercado Pago</strong> (PIX, Cartão e Boleto).</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
