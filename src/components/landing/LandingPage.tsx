import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Radio, 
  Cpu, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Zap, 
  Share2, 
  FileText,
  Users,
  Building2,
  ChevronRight,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
  onExploreDemo: () => void;
}

export function LandingPage({ onOpenLogin, onExploreDemo }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col font-['Inter',sans-serif]">
      
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-600/30">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight font-heading text-white">
                  Sentinela<span className="text-indigo-400">.ai</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Social Listening & Crisis Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links & Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onExploreDemo}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all border border-slate-800"
            >
              <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
              Ver Demonstração
            </button>

            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Lock className="w-3.5 h-3.5" />
              Acessar Plataforma
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glow Gradients Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Inteligência Preditiva de Gestão de Marca & Riscos</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span className="text-slate-400">IA Generativa 3.6 Core</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Social Listening Multimodal &{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Gestão Preditiva de Crises
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Monitore a reputação da sua marca em tempo real no Instagram, TikTok, X, YouTube e notícias. 
            Detecção antecipada de ameaças virais, transcrição por IA e sínteses executivas instantâneas.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-sm font-bold text-white shadow-xl shadow-indigo-600/35 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <span>Entrar no Painel do Cliente</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 text-sm font-semibold text-slate-200 border border-slate-800 transition-all flex items-center justify-center gap-2.5 backdrop-blur-md"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Explorar Modo Demonstração</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
              <p className="text-2xl font-black font-heading text-white">99.8%</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Acurácia no Sentimento IA</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
              <p className="text-2xl font-black font-heading text-emerald-400">&lt; 30s</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Alerta Preditivo de Crise</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
              <p className="text-2xl font-black font-heading text-indigo-400">6 Redes</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Varredura Multicanal Simultânea</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
              <p className="text-2xl font-black font-heading text-purple-400">1 Clique</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Relatórios C-Level com IA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Platform Preview Card */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl p-1 bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-slate-950 shadow-2xl shadow-indigo-950/50">
          <div className="rounded-[22px] bg-[#0d1322] p-6 sm:p-8 space-y-6">
            
            {/* Top Preview Bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-xs font-mono text-slate-400">sentinela.ai/radar-executivo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  RADAR ATIVO
                </span>
              </div>
            </div>

            {/* Feature Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Health Score */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Health Score da Marca</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold font-heading text-white">88</span>
                  <span className="text-xs text-emerald-400 font-bold">+4% esta semana</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full w-[88%] rounded-full"></div>
                </div>
                <p className="text-[11px] text-slate-400">Reputação estável com predominância de menções positivas.</p>
              </div>

              {/* Card 2: Alertas de Crise */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Central de Contenção de Crises</span>
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-300">Pico de Reclamações Detectado</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">Sugestão IA: Disparar nota oficial sobre instabilidade do servidor.</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Análise IA */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>AI Executive Summary</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-200 font-medium">
                  "Menções do lançamento do novo recurso cresceram +140% no TikTok com 94% de sentimento favorável."
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading text-white sm:text-4xl">
              Recursos Avançados de Social Listening
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Desenvolvido com o rigor executivo necessário para agências de PR, gestão de imagem e líderes de comunicação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Radar Executivo 360°</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Acompanhe o Health Score da marca (0-100), termômetro de sentimento em tempo real e timeline de volume de menções com detecção automática de anomalias.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Transcrição IA de Vídeo & Áudio</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                IA generativa multimodal que escuta e transcreve reels do Instagram, vídeos do TikTok e Shorts do YouTube para identificar riscos ocultos.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Central de Gestão de Crises</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Alertas preditivos em tempo real para equipe de PR/Sócio com recomendações diretas de contenção de danos e minutas de resposta oficial.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Síntese Executiva Diária</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Gere um relatório pronto para diretoria e C-Level em 1 clique com mapeamento de Key Drivers de atrito e recomendações estratégicas.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-600/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Benchmark de Concorrentes</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Compare a reputação e o Share of Voice da sua empresa em relação aos principais concorrentes do mercado simultaneamente.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Gestão Multi-Usuários & Roles</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Níveis de acesso flexíveis para Administradores, Analistas de Social Media e Clientes Executivos com trilhas de auditoria.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Subscription Plans & Pricing Section */}
      <section className="py-20 bg-[#070a13] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Planos Transparentes & Sem Fidelidade</span>
            </div>
            <h2 className="text-3xl font-bold font-heading text-white sm:text-4xl">
              Escolha a Escala de Monitoramento da sua Marca
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Todos os planos contam com a suíte de 12 serviços integrados, inteligência artificial e proteção 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* Plano Starter */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">Starter</h3>
                  <p className="text-xs text-slate-400 mt-1">Marcas individuais e pequenos negócios.</p>
                </div>

                <div className="py-3 border-y border-slate-800/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-slate-400">R$</span>
                    <span className="text-3xl font-black text-white">297</span>
                    <span className="text-xs text-slate-400">/mês</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 1 Marca / Alvo Monitorado</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Até 5.000 menções/mês</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Instagram, X e Notícias</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Varredura a cada 2h</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Relatórios Mensais de IA</li>
                </ul>
              </div>

              <button
                onClick={onOpenLogin}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all"
              >
                Começar no Starter
              </button>
            </div>

            {/* Plano Pro */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/50 shadow-xl shadow-indigo-950/40 relative flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-bold text-white shadow-md">
                Mais Popular
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">Professional</h3>
                  <p className="text-xs text-slate-400 mt-1">Para agências de PR e marcas ativas.</p>
                </div>

                <div className="py-3 border-y border-slate-800/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-slate-400">R$</span>
                    <span className="text-3xl font-black text-white">790</span>
                    <span className="text-xs text-slate-400">/mês</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 3 Marcas Simultâneas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Até 50.000 menções/mês</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Todos os 6 Canais + TikTok</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Transcrição de Vídeo por IA</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Benchmarking de Concorrentes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Até 3 Usuários de Equipe</li>
                </ul>
              </div>

              <button
                onClick={onOpenLogin}
                className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Contratar Professional</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Plano Enterprise */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">Enterprise</h3>
                  <p className="text-xs text-slate-400 mt-1">Corporações e monitoramento 24/7.</p>
                </div>

                <div className="py-3 border-y border-slate-800/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-slate-400">R$</span>
                    <span className="text-3xl font-black text-white">1.890</span>
                    <span className="text-xs text-slate-400">/mês</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 10 Marcas Monitoradas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 250.000+ menções/mês</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Radar em Tempo Real Contínuo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Alertas Críticos no WhatsApp</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Relatórios Executivos Diários</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Até 15 Usuários Admin</li>
                </ul>
              </div>

              <button
                onClick={onOpenLogin}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all"
              >
                Assinar Enterprise
              </button>
            </div>

            {/* Plano Governo / Smart City */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">Governo & Cidades</h3>
                  <p className="text-xs text-slate-400 mt-1">Centros de Operações e Prefeituras.</p>
                </div>

                <div className="py-3 border-y border-slate-800/80">
                  <span className="text-2xl font-extrabold text-white">Sob Medida</span>
                  <p className="text-[10px] text-slate-500">Contratos públicos & termos</p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Múltiplas Secretarias e Órgãos</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Trânsito, Chuvas e Defesa Civil</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Vigilância e Câmeras Integradas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Usuários Ilimitados para Equipes</li>
                </ul>
              </div>

              <button
                onClick={onOpenLogin}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all"
              >
                Solicitar Proposta
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-900/50 via-slate-900 to-purple-900/50 border border-indigo-500/30 shadow-2xl backdrop-blur-xl space-y-6">
            <h2 className="text-3xl font-extrabold font-heading text-white sm:text-4xl">
              Proteja e Fortaleça a Reputação da Sua Marca
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Acesse a plataforma **Sentinela.ai** agora mesmo e tenha total controle das conversas e sentimentos da sua audiência.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-sm font-bold text-white shadow-xl shadow-indigo-600/35 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Entrar no Sistema Sentinela</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-heading">Sentinela.ai</span>
            <span>— Squad A-Team (Mario Henrique & Antigravity AI)</span>
          </div>
          <p>© {new Date().getFullYear()} Sentinela Tech Inc. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
