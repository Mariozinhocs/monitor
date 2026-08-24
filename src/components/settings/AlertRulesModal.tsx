import React, { useState } from 'react';
import { BellRing, Plus, Trash2, CheckCircle2, Shield, Zap } from 'lucide-react';

interface Rule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
}

export const AlertRulesModal: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: 'rule-1',
      name: 'Pico Anormal de Menções Negativas',
      condition: 'Volume negativo subir > 30% em intervalo de 1 hora',
      action: 'Notificar WhatsApp do Squad de Crise + E-mail C-Level',
      enabled: true
    },
    {
      id: 'rule-2',
      name: 'Detecção de Termos Sensíveis de Risco Legal',
      condition: 'Post contendo "Procon", "Processo Judicial", "Vazamento" ou "Fraude"',
      action: 'Classificar como Crítico + Criar ticket de alta prioridade',
      enabled: true
    },
    {
      id: 'rule-3',
      name: 'Influenciador de Alto Alcance (> 100k)',
      condition: 'Qualquer menção feita por conta verificada ou > 100k seguidores',
      action: 'Alerta instantâneo no Telegram / Slack',
      enabled: true
    },
    {
      id: 'rule-4',
      name: 'Vídeo Viral no TikTok com Menção à Marca',
      condition: 'Vídeo ultrapassar 5.000 visualizações em menos de 2 horas',
      action: 'Executar transcrição de áudio por IA e análise de sentimento',
      enabled: true
    }
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <BellRing className="h-5 w-5 text-indigo-400" />
              Regras de Gatilho & Automações de Crise
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure limites estatísticos e palavras-chave que disparam alertas automáticos para o time de resposta rápida.
            </p>
          </div>

          <button
            onClick={() => {
              const newRule: Rule = {
                id: `rule-${Date.now()}`,
                name: 'Nova Regra de Alerta',
                condition: 'Reclamações contendo novas palavras-chave',
                action: 'Disparar notificação instantânea',
                enabled: true
              };
              setRules([...rules, newRule]);
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Criar Nova Regra</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-semibold text-emerald-400 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4" />
          <span>Configurações salvas e aplicadas ao radar com sucesso!</span>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-3.5">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-slate-700"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{rule.name}</span>
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                  rule.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                }`}>
                  {rule.enabled ? 'Ativo' : 'Pausado'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                <strong className="text-slate-400">Gatilho:</strong> {rule.condition}
              </p>
              <p className="text-xs text-indigo-300">
                <strong className="text-slate-400">Ação Automática:</strong> {rule.action}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleRule(rule.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  rule.enabled ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    rule.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <button
                onClick={() => setRules(rules.filter(r => r.id !== rule.id))}
                className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Excluir regra"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
