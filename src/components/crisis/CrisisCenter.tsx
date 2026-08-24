import React, { useState } from 'react';
import { CrisisAlert } from '../../types/monitor';
import { 
  ShieldAlert, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Send, 
  Sparkles, 
  TrendingDown, 
  BellRing,
  ExternalLink
} from 'lucide-react';

interface CrisisCenterProps {
  alerts: CrisisAlert[];
  onResolveAlert: (alertId: string) => void;
}

export const CrisisCenter: React.FC<CrisisCenterProps> = ({ alerts, onResolveAlert }) => {
  const [selectedAlert, setSelectedAlert] = useState<CrisisAlert>(alerts[0]);
  const [notificationSent, setNotificationSent] = useState(false);

  const handleNotifyTeam = () => {
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header da Central de Crises */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border-rose-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <h2 className="text-xl font-bold font-heading text-white">
                Central de Vigilância & Gestão de Crises
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              O motor de IA monitora picos estatísticos de menções negativas, termos sensíveis e influenciadores de alto alcance em tempo real para antecipar crises antes de sua viralização.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNotifyTeam}
              className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all active:scale-95"
            >
              <BellRing className="h-4 w-4" />
              <span>{notificationSent ? 'Disparo Enviado via WhatsApp/Slack!' : 'Disparar Alerta para Squad / C-Level'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Alertas e Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lista de Alertas Ativos */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-1">
            Gatilhos Acionados ({alerts.length})
          </h3>

          {alerts.map((alert) => {
            const isSelected = selectedAlert?.id === alert.id;
            const isCritical = alert.severity === 'critical';

            return (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`glass-panel cursor-pointer rounded-2xl p-4 transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-950/20 shadow-md shadow-rose-950/50'
                    : 'hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                    isCritical
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {alert.triggeredAt}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white line-clamp-2">
                  {alert.title}
                </h4>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Canal: <strong className="capitalize text-slate-200">{alert.channel}</strong></span>
                  <span className="text-rose-400 font-bold">{alert.negativeRatio}% Rejeição</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Painel de Diagnóstico & Plano de Contenção da IA */}
        {selectedAlert && (
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-5 border-slate-800">
            
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-xs font-bold text-rose-400">
                    Incidente #{selectedAlert.id}
                  </span>
                  <span className="text-xs text-slate-400">
                    Origem: <strong className="capitalize text-white">{selectedAlert.channel}</strong>
                  </span>
                </div>
                <h3 className="text-lg font-bold font-heading text-white mt-1">
                  {selectedAlert.title}
                </h3>
              </div>

              <button
                onClick={() => onResolveAlert(selectedAlert.id)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white transition-all shadow-sm shadow-emerald-600/20 whitespace-nowrap"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Marcar como Contido</span>
              </button>
            </div>

            {/* Descrição do Incidente */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Descrição do Cenário:</span>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                {selectedAlert.description}
              </p>
            </div>

            {/* Tópicos Impactados */}
            <div>
              <span className="text-xs font-semibold text-slate-400 mb-2 block">Tópicos e Termos Envolvidos:</span>
              <div className="flex flex-wrap gap-2">
                {selectedAlert.affectedTopics.map((topic) => (
                  <span key={topic} className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 text-xs font-semibold text-rose-300">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Plano de Ação Recomendado por IA */}
            <div className="rounded-xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span>Plano de Contenção Imediata (Sentinela Crisis AI):</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {selectedAlert.recommendedAction}
              </p>
            </div>

            {/* Protocolo de Ações Sugeridas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 text-xs">
                <span className="text-slate-400 block mb-1">1. Comunicação</span>
                <strong className="text-white">Emitir Nota Oficial</strong>
              </div>
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 text-xs">
                <span className="text-slate-400 block mb-1">2. Atendimento</span>
                <strong className="text-white">Fila de Prioridade SAC</strong>
              </div>
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 text-xs">
                <span className="text-slate-400 block mb-1">3. Jurídico / PR</span>
                <strong className="text-white">Monitorar Procon/ReclameAqui</strong>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
