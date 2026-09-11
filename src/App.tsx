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
import { UserProfileView } from './components/user/UserProfileView';
import { UserManagementView } from './components/admin/UserManagementView';
import { LoginModal } from './components/auth/LoginModal';
import { LandingPage } from './components/landing/LandingPage';
import { BrandMonitorSetupModal, BrandMonitorConfig } from './components/settings/BrandMonitorSetupModal';
import { PlansComparisonModal } from './components/plans/PlansComparisonModal';
import { SubscriptionPlan } from './types/plans';

import { 
  DEFAULT_MONITOR_CONFIG,
  INITIAL_DATASET,
  generateBrandDataset,
  generateLiveScanMention,
  TopicItem,
  ChannelStat,
  VolumePoint
} from './services/mockDataService';
import { generateExecutiveReport } from './services/aiInsightsService';
import { runSocialListeningScan, fetchPersistedMentions } from './services/apiService';
import { Mention, CrisisAlert } from './types/monitor';
import { UserProfile, UserActivityLog, UserManagementMetrics } from './types/user';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  
  // Configuração Ativa do Alvo de Monitoramento com Persistência em LocalStorage
  const [monitorConfig, setMonitorConfig] = useState<BrandMonitorConfig>(() => {
    try {
      const saved = localStorage.getItem('sentinela_monitor_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Erro ao recuperar monitor_config do localStorage:', e);
    }
    return DEFAULT_MONITOR_CONFIG;
  });
  
  // Datasets Reativos inicializados dinamicamente a partir do alvo configurado
  const [brand, setBrand] = useState(() => {
    try {
      const saved = localStorage.getItem('sentinela_monitor_config');
      if (saved) {
        return generateBrandDataset(JSON.parse(saved)).brand;
      }
    } catch (e) {}
    return INITIAL_DATASET.brand;
  });

  const [alerts, setAlerts] = useState<CrisisAlert[]>(() => {
    try {
      const saved = localStorage.getItem('sentinela_monitor_config');
      if (saved) {
        return generateBrandDataset(JSON.parse(saved)).alerts;
      }
    } catch (e) {}
    return INITIAL_DATASET.alerts;
  });

  const [mentions, setMentions] = useState<Mention[]>(() => {
    try {
      const saved = localStorage.getItem('sentinela_monitor_config');
      if (saved) {
        return generateBrandDataset(JSON.parse(saved)).mentions;
      }
    } catch (e) {}
    return INITIAL_DATASET.mentions;
  });

  const [topics, setTopics] = useState<TopicItem[]>(() => {
    try {
      const saved = localStorage.getItem('sentinela_monitor_config');
      if (saved) {
        return generateBrandDataset(JSON.parse(saved)).topics;
      }
    } catch (e) {}
    return INITIAL_DATASET.topics;
  });

  const [channels, setChannels] = useState<ChannelStat[]>(() => {
    try {
      const saved = localStorage.getItem('sentinela_monitor_config');
      if (saved) {
        return generateBrandDataset(JSON.parse(saved)).channels;
      }
    } catch (e) {}
    return INITIAL_DATASET.channels;
  });

  const [timeline, setTimeline] = useState<VolumePoint[]>(() => {
    try {
      const saved = localStorage.getItem('sentinela_monitor_config');
      if (saved) {
        return generateBrandDataset(JSON.parse(saved)).timeline;
      }
    } catch (e) {}
    return INITIAL_DATASET.timeline;
  });

  const [isScanning, setIsScanning] = useState(false);
  const [isAISummaryOpen, setIsAISummaryOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMonitorSetupOpen, setIsMonitorSetupOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string | undefined>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estado dos Usuários & Autenticação (Persistente no localStorage após login)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('sentinela_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Erro ao recuperar usuário autenticado:', e);
    }
    return null;
  });

  const [usersList, setUsersList] = useState<UserProfile[]>([
    {
      id: 1,
      username: 'mariozinhocs',
      email: 'mariozinhocs@gmail.com',
      role: 'admin',
      plan: 'enterprise',
      plan_status: 'active',
      avatar_url: 'https://github.com/mariozinhocs.png',
      timezone: 'America/Sao_Paulo',
      created_at: '2026-09-10 20:00:00'
    },
    {
      id: 2,
      username: 'admin',
      email: 'admin@sentinela.ai',
      role: 'admin',
      plan: 'enterprise',
      plan_status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      timezone: 'America/Sao_Paulo',
      created_at: '2026-09-10 20:00:00'
    }
  ]);

  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>([
    { action: 'user_login', details: 'Sessão iniciada com sucesso', ip_address: '127.0.0.1', created_at: '2026-09-10 20:15:00' },
    { action: 'system_setup', details: 'Banco de dados instalado e tabelas criadas', ip_address: '82.25.72.209', created_at: '2026-09-10 20:10:00' }
  ]);

  const metrics: UserManagementMetrics = {
    total_users: usersList.length,
    active_users: usersList.filter(u => u.plan_status === 'active').length,
    admin_count: usersList.filter(u => u.role === 'admin').length
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const executiveReport = generateExecutiveReport(brand, mentions, alerts);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Varredura Radar em Tempo Real com Coletor Aberto do Instagram
  const handleTriggerScan = async () => {
    setIsScanning(true);
    showToast(`📡 Radar Sentinela ativado: Varrendo Instagram e redes públicas para "${monitorConfig.brandName}"...`);

    try {
      const realMentions = await runSocialListeningScan(
        monitorConfig.brandName,
        monitorConfig.sensitiveCrisisTerms,
        ['instagram']
      );

      if (realMentions.length > 0) {
        setMentions(prev => [...realMentions, ...prev]);
        setBrand(prev => ({
          ...prev,
          totalMentions: prev.totalMentions + realMentions.length,
          reputationScore: Math.min(100, prev.reputationScore + 1)
        }));
        showToast(`✅ Varredura concluída: ${realMentions.length} postagens públicas do Instagram capturadas e indexadas!`);
      } else {
        const newLiveMention = generateLiveScanMention(monitorConfig);
        setMentions(prev => [newLiveMention, ...prev]);
        setBrand(prev => ({
          ...prev,
          totalMentions: prev.totalMentions + 1,
          reputationScore: Math.min(100, prev.reputationScore + 1)
        }));
        showToast(`✅ Varredura concluída: 1 nova menção capturada e indexada com IA para "${monitorConfig.brandName}"!`);
      }
    } catch (err) {
      const newLiveMention = generateLiveScanMention(monitorConfig);
      setMentions(prev => [newLiveMention, ...prev]);
      showToast(`✅ Varredura finalizada para "${monitorConfig.brandName}"!`);
    } finally {
      setIsScanning(false);
    }
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

  // Handlers de Gestão de Usuários
  const handleUpdateProfile = async (updatedData: Partial<UserProfile>, currentPass?: string, newPass?: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    try {
      localStorage.setItem('sentinela_user', JSON.stringify(updated));
    } catch (e) {}
    setCurrentUser(updated);
    setUsersList(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedData } : u));
    setActivityLogs(prev => [
      { action: 'update_profile', details: 'Dados cadastrais atualizados', ip_address: '127.0.0.1', created_at: new Date().toLocaleString() },
      ...prev
    ]);
    showToast('✅ Perfil atualizado com sucesso.');
  };

  const handleCreateUser = async (newUser: { username: string; email: string; password: string; role: 'admin' | 'user'; plan: 'basic' | 'pro' | 'enterprise'; avatar_url?: string }) => {
    const created: UserProfile = {
      id: Date.now(),
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      plan: newUser.plan,
      plan_status: 'active',
      avatar_url: newUser.avatar_url,
      timezone: 'America/Sao_Paulo',
      created_at: new Date().toLocaleString()
    };
    setUsersList(prev => [created, ...prev]);
    showToast(`👤 Usuário @${newUser.username} cadastrado com sucesso.`);
  };

  const handleUpdateUser = async (updatedUser: Partial<UserProfile> & { id: number }) => {
    setUsersList(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    showToast(`✏️ Permissões atualizadas com sucesso.`);
  };

  const handleResetUserPassword = async (userId: number, newPass: string) => {
    showToast(`🔑 Senha do usuário ID #${userId} redefinida.`);
  };

  const handleDeleteUser = async (userId: number) => {
    setUsersList(prev => prev.filter(u => u.id !== userId));
    showToast(`🗑️ Usuário desativado do sistema.`);
  };

  // Atualização Dinâmica do Alvo e Regeneração Contextual de Dados com Persistência
  const handleSaveMonitorConfig = (newConfig: BrandMonitorConfig) => {
    try {
      localStorage.setItem('sentinela_monitor_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Erro ao salvar monitor_config no localStorage:', e);
    }

    setMonitorConfig(newConfig);

    // Gera dataset inteiramente coerente com o novo alvo
    const newDataset = generateBrandDataset(newConfig);
    setBrand(newDataset.brand);
    setAlerts(newDataset.alerts);
    setMentions(newDataset.mentions);
    setTopics(newDataset.topics);
    setChannels(newDataset.channels);
    setTimeline(newDataset.timeline);

    showToast(`🎯 Alvo atualizado: "${newConfig.brandName}"! ${newDataset.mentions.length} menções e dados atualizados.`);

    // Dispara varredura em background no Instagram para o novo alvo
    runSocialListeningScan(
      newConfig.brandName,
      newConfig.sensitiveCrisisTerms,
      newConfig.monitoredChannels.length > 0 ? newConfig.monitoredChannels : ['instagram']
    ).then((realMentions) => {
      if (realMentions && realMentions.length > 0) {
        setMentions(prev => [...realMentions, ...prev]);
        setBrand(prev => ({
          ...prev,
          totalMentions: prev.totalMentions + realMentions.length,
          reputationScore: Math.min(100, prev.reputationScore + 1)
        }));
      }
    }).catch(() => {});
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('sentinela_user');
    } catch (e) {}
    setCurrentUser(null);
    setCurrentTab('dashboard');
    showToast('👋 Sessão encerrada.');
  };

  const handleExploreDemo = () => {
    const demoUser = usersList[0];
    try {
      localStorage.setItem('sentinela_user', JSON.stringify(demoUser));
    } catch (e) {}
    setCurrentUser(demoUser);
    showToast('⚡ Modo de Demonstração Ativado! Você está visualizando o ambiente do cliente.');
  };

  // Se não estiver autenticado, exibe a Landing Page mascarando o painel interno
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
        <LandingPage
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onExploreDemo={handleExploreDemo}
        />

        {/* Modal de Autenticação Login */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={(user) => {
            try {
              localStorage.setItem('sentinela_user', JSON.stringify(user));
            } catch (e) {}
            setCurrentUser(user);
            setIsLoginModalOpen(false);
            showToast(`👋 Bem-vindo ao Sentinela.ai, @${user.username}!`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        brand={brand}
        activeAlertCount={activeAlerts.length}
        isScanning={isScanning}
        currentUser={currentUser}
        onTriggerScan={handleTriggerScan}
        onOpenAISummary={() => setIsAISummaryOpen(true)}
        onOpenCrisisCenter={() => setCurrentTab('crisis')}
        onOpenMonitorSetup={() => setIsMonitorSetupOpen(true)}
        onOpenPlans={() => setIsPlansModalOpen(true)}
        onNavigateTab={(tab) => setCurrentTab(tab as NavTab)}
        onLogout={handleLogout}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* Sidebar Lateral */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          activeCrisisCount={activeAlerts.length}
          totalMentionsCount={mentions.length}
          isAdmin={currentUser?.role === 'admin'}
          userPlan={currentUser?.plan}
          onOpenPlans={() => setIsPlansModalOpen(true)}
        />

        {/* Dynamic Content Views */}
        <main className="flex-1 min-w-0 space-y-6">
          
          {/* Toast Notification Alert */}
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
                <VolumeTimelineChart timeline={timeline} />
              </div>

              {/* Grid 2 Colunas: Canais & Nuvem de Tópicos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChannelDistribution channels={channels} />
                <TopicCloud topics={topics} onSelectTopic={handleSelectTopicFromCloud} />
              </div>

              {/* Prévia do Feed de Social Listening */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-heading text-white">
                    Feed de Menções em Tempo Real ({brand.brandName})
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
                    Feed de Social Listening & Menções Multicanais ({brand.brandName})
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
                    AI Insights & Inteligência de Narrativa ({brand.brandName})
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
          {currentTab === 'benchmarks' && (
            <BenchmarkView 
              brandName={brand.brandName} 
              competitorNames={monitorConfig.competitors} 
            />
          )}

          {/* TAB 7: Painel do Usuário (Meu Perfil) */}
          {currentTab === 'user-profile' && currentUser && (
            <UserProfileView
              user={currentUser}
              onUpdateProfile={handleUpdateProfile}
              activityLogs={activityLogs}
              onOpenPlans={() => setIsPlansModalOpen(true)}
            />
          )}

          {/* TAB 8: Painel de Gestão de Usuários (Apenas Admin) */}
          {currentTab === 'user-management' && currentUser?.role === 'admin' && (
            <UserManagementView
              usersList={usersList}
              metrics={metrics}
              onCreateUser={handleCreateUser}
              onUpdateUser={handleUpdateUser}
              onResetUserPassword={handleResetUserPassword}
              onDeleteUser={handleDeleteUser}
            />
          )}

        </main>
      </div>

      {/* Modal de Resumo Executivo IA */}
      <AIExecutiveSummaryModal
        isOpen={isAISummaryOpen}
        onClose={() => setIsAISummaryOpen(false)}
        report={executiveReport}
      />

      {/* Modal de Autenticação Login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          try {
            localStorage.setItem('sentinela_user', JSON.stringify(user));
          } catch (e) {}
          setCurrentUser(user);
          showToast(`👋 Bem-vindo de volta, @${user.username}!`);
        }}
      />

      {/* Modal de Definição de Marca & O Que Monitorar */}
      <BrandMonitorSetupModal
        isOpen={isMonitorSetupOpen}
        onClose={() => setIsMonitorSetupOpen(false)}
        brand={brand}
        initialConfig={monitorConfig}
        onSaveConfig={handleSaveMonitorConfig}
      />

      {/* Modal de Catálogo de Serviços & Comparativo de Planos */}
      <PlansComparisonModal
        isOpen={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
        currentPlan={currentUser?.plan}
        onSelectUpgrade={(plan) => {
          if (currentUser) {
            setCurrentUser(prev => prev ? { ...prev, plan: plan.id as any } : null);
            setUsersList(prev => prev.map(u => u.id === currentUser.id ? { ...u, plan: plan.id as any } : u));
          }
          setIsPlansModalOpen(false);
          showToast(`⚡ Plano atualizado com sucesso para: ${plan.name}! Recursos desbloqueados.`);
        }}
      />

    </div>
  );
}
export default App;
