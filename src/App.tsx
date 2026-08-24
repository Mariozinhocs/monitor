import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { RadarOverview } from './components/dashboard/RadarOverview';
import { SentimentGauge } from './components/dashboard/SentimentGauge';
import { VolumeTimelineChart } from './components/dashboard/VolumeTimelineChart';
import { ChannelDistribution } from './components/dashboard/ChannelDistribution';
import { TopicCloud } from './components/dashboard/TopicCloud';
import { MentionsFeed } from './components/listening/MentionsFeed';
import { CrisisCenter } from './components/crisis/CrisisCenter';
import { AIExecutiveSummaryModal } from './components/insights/AIExecutiveSummaryModal';
import { AlertRulesModal } from './components/settings/AlertRulesModal';
import { BenchmarkView } from './components/benchmarks/BenchmarkView';

import { 
  INITIAL_BRAND, 
  INITIAL_ALERTS, 
  INITIAL_MENTIONS 
} from './services/mockDataService';
import { generateExecutiveReport } from './services/aiInsightsService';
import { Mention, CrisisAlert } from './types/monitor';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [brand, setBrand] = useState(INITIAL_BRAND);
  const [alerts, setAlerts] = useState<CrisisAlert[]>(INITIAL_ALERTS);
  const [mentions, setMentions] = useState<Mention[]>(INITIAL_MENTIONS);
  const [isScanning, setIsScanning] = useState(false);
  const [isAISummaryOpen, setIsAISummaryOpen] = useState(false);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string | undefined>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const executiveReport = generateExecutiveReport(brand, mentions, alerts);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Simulação de Varredura Radar em Tempo Real
  const handleTriggerScan = () => {
    setIsScanning(true);
    showToast('📡 Radar Sentinela ativado: Varrendo Instagram, TikTok, X, YouTube e Notícias...');

    setTimeout(() => {
      // Injeta uma nova menção em tempo real
      const newLiveMention: Mention = {
        id: `men-${Date.now()}`,
        channel: 'twitter',
        author: {
          name: 'Lucas Brandão',
          username: '@lucas_brandao',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 1820,
        },
        content: 'Impressionado com a rapidez da equipe do @SentinelaTech no suporte. Resolveram meu acesso em 5 minutos! 👏🚀',
        timestamp: 'Agora mesmo',
        likes: 14,
        comments: 2,
        shares: 1,
        sentiment: 'positive',
        sentimentScore: 0.96,
        riskLevel: 'low',
        topics: ['#SuporteNota10', 'Sentinela.ai', 'Agilidade'],
        reachEstimate: 3200,
        aiAnalysis: {
          summary: 'Elogio direto ao tempo de resposta do suporte pós-resolução.',
          emotion: 'Agradecimento',
          crisisIndicator: false,
          suggestedAction: 'Curtir e responder com emoji de agradecimento.',
        }
      };

      setMentions(prev => [newLiveMention, ...prev]);
      setBrand(prev => ({
        ...prev,
        totalMentions: prev.totalMentions + 1,
        reputationScore: Math.min(100, prev.reputationScore + 1)
      }));
      setIsScanning(false);
      showToast('✅ Varredura concluída: 1 nova menção capturada e indexada com IA!');
    }, 2200);
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a));
    setBrand(prev => ({
      ...prev,
      activeCrisisCount: Math.max(0, prev.activeCrisisCount - 1),
      reputationScore: Math.min(100, prev.reputationScore + 2)
    }));
    showToast('🛡️ Incidente marcado como contido com sucesso.');
  };

  const handleSelectTopicFromCloud = (topic: string) => {
    setSelectedTopicFilter(topic);
    setCurrentTab('listening');
    showToast(`Filtrando feed de menções pelo tópico: #${topic}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        brand={brand}
        isScanning={isScanning}
        onTriggerScan={handleTriggerScan}
        onOpenAISummary={() => setIsAISummaryOpen(true)}
        onOpenCrisisCenter={() => setCurrentTab('crisis')}
        activeAlertCount={activeAlerts.length}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          activeCrisisCount={activeAlerts.length}
          totalMentionsCount={mentions.length}
        />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-indigo-500/40 bg-slate-900/95 backdrop-blur-xl px-4 py-3 text-xs font-semibold text-white shadow-2xl shadow-indigo-950/60 flex items-center gap-3 animate-fadeIn">
              <span>{toastMessage}</span>
            </div>
          )}

          {/* TAB 1: Painel Radar (Dashboard Executivo) */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* KPIs & Health Score */}
              <RadarOverview brand={brand} isScanning={isScanning} />

              {/* Grid 2 Colunas: Sentimento & Volume Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SentimentGauge sentiment={brand.sentimentSplit} />
                <VolumeTimelineChart />
              </div>

              {/* Grid 2 Colunas: Canais & Nuvem de Tópicos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChannelDistribution />
                <TopicCloud onSelectTopic={handleSelectTopicFromCloud} />
              </div>

              {/* Prévia do Feed de Social Listening */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-heading text-white">
                    Feed de Menções em Tempo Real
                  </h3>
                  <button
                    onClick={() => setCurrentTab('listening')}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    Ver todas as menções ({mentions.length}) →
                  </button>
                </div>

                <MentionsFeed mentions={mentions.slice(0, 3)} />
              </div>

            </div>
          )}

          {/* TAB 2: Social Listening Feed */}
          {currentTab === 'listening' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-heading text-white">
                    Feed de Social Listening & Menções Multicanais
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Transcrições de vídeo/áudio, sentimento de postagens e diagnóstico de IA em tempo real.
                  </p>
                </div>
              </div>

              <MentionsFeed
                mentions={mentions}
                selectedTopicFilter={selectedTopicFilter}
                onClearTopicFilter={() => setSelectedTopicFilter(undefined)}
              />
            </div>
          )}

          {/* TAB 3: Gestão de Crises */}
          {currentTab === 'crisis' && (
            <CrisisCenter
              alerts={alerts}
              onResolveAlert={handleResolveAlert}
            />
          )}

          {/* TAB 4: AI Insights & Relatórios */}
          {currentTab === 'insights' && (
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-heading text-white">
                    AI Insights & Inteligência de Narrativa
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Análise qualitativa profunda dos dados coletados nas redes, correlação de sentimento e recomendações de PR.
                  </p>
                </div>
                <button
                  onClick={() => setIsAISummaryOpen(true)}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all"
                >
                  Abrir Relatório Executivo Completo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Principais Conclusões do Dia
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {executiveReport.executiveSummary}
                  </p>
                </div>

                <div className="glass-panel rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                    Plano de Ação Recomendado
                  </h3>
                  <div className="space-y-2">
                    {executiveReport.strategicRecommendations.map((rec, i) => (
                      <div key={i} className="text-xs text-slate-200 bg-slate-900/80 rounded-lg p-2.5 border border-slate-800">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Regras de Gatilhos & Alertas */}
          {currentTab === 'rules' && <AlertRulesModal />}

          {/* TAB 6: Benchmarks de Concorrentes */}
          {currentTab === 'benchmarks' && <BenchmarkView />}

        </main>
      </div>

      {/* Modal de Resumo Executivo IA */}
      <AIExecutiveSummaryModal
        isOpen={isAISummaryOpen}
        onClose={() => setIsAISummaryOpen(false)}
        report={executiveReport}
      />

    </div>
  );
}
export default App;
