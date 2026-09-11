// Definições de Tipos e Catálogo de Serviços - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// "si vis pacem para bellum"

import { SocialChannel } from './monitor';

export type PlanTier = 'basic' | 'starter' | 'pro' | 'enterprise' | 'governo';

export type ServiceCategory = 'listening' | 'ai' | 'crisis' | 'governance' | 'integration';

export interface ServiceItem {
  id: string; // Ex: 'S01', 'S02'
  code: string;
  name: string;
  category: ServiceCategory;
  categoryLabel: string;
  shortDescription: string;
  detailedDescription: string;
  icon: string;
  minPlan: PlanTier;
  isPopular?: boolean;
}

export interface PlanLimits {
  maxBrands: number; // Quantidade de marcas/órgãos
  monthlyMentionsLimit: number; // Volume máximo de postagens indexadas/mês
  monitoredChannels: SocialChannel[];
  scanIntervalMinutes: number; // Intervalo de varredura radar
  maxAlertsActive: number;
  maxTeamMembers: number;
  hasVideoAudioTranscription: boolean;
  hasPredictiveCrisisAI: boolean;
  hasWhatsAppAlerts: boolean;
  hasCustomCompetitors: boolean;
  hasExecutiveReportsPdf: boolean;
  hasDedicatedSupportSLA: boolean;
}

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnualMonthly: number;
  billingPeriod: string;
  badge?: string;
  isFeatured?: boolean;
  isCustomPrice?: boolean;
  limits: PlanLimits;
  highlightedFeatures: string[];
  serviceCodes: string[];
}

// Catálogo Oficial dos 12 Serviços do Sentinela.ai
export const SENTINELA_SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'S01',
    code: 'social-listening-multicanal',
    name: 'Social Listening Multicanal',
    category: 'listening',
    categoryLabel: 'Escuta Ativa',
    shortDescription: 'Monitoramento em tempo real de 6 canais sociais e web.',
    detailedDescription: 'Indexação contínua de postagens no Instagram, TikTok, X (Twitter), YouTube, Portais de Notícias e Reddit/Fóruns.',
    icon: 'Radio',
    minPlan: 'starter',
    isPopular: true
  },
  {
    id: 'S02',
    code: 'transcricao-multimodal-ia',
    name: 'Transcrição Multimodal de IA',
    category: 'ai',
    categoryLabel: 'Inteligência Artificial',
    shortDescription: 'Conversão automática de áudio e vídeo em texto pesquisável.',
    detailedDescription: 'Processamento de voz de vídeos curtos (Reels, TikToks e Shorts) para identificar menções à marca faladas em mídia audiovisual.',
    icon: 'Sparkles',
    minPlan: 'pro',
    isPopular: true
  },
  {
    id: 'S03',
    code: 'analise-sentimento-tempo-real',
    name: 'Classificação de Sentimento Preditiva',
    category: 'ai',
    categoryLabel: 'Inteligência Artificial',
    shortDescription: 'Taxonomia automatizada: Positivo, Neutro, Negativo e Crítico.',
    detailedDescription: 'Motor de Processamento de Linguagem Natural com score numérico de probabilidade, detecção de ironia e diagnóstico de emoção predominante.',
    icon: 'Activity',
    minPlan: 'starter'
  },
  {
    id: 'S04',
    code: 'gestao-e-contencao-crises',
    name: 'Central de Gestão & Contenção de Crises',
    category: 'crisis',
    categoryLabel: 'Mitigação de Riscos',
    shortDescription: 'Detecção instantânea de picos de anomalia e playbooks de PR.',
    detailedDescription: 'Alertas automáticos de gravidade crítica com cálculo de velocidade viral e recomendações estratégicas imediatas de resposta.',
    icon: 'ShieldAlert',
    minPlan: 'starter',
    isPopular: true
  },
  {
    id: 'S05',
    code: 'multi-alvos-marcas',
    name: 'Múltiplos Alvos & Órgãos de Monitoramento',
    category: 'governance',
    categoryLabel: 'Governança',
    shortDescription: 'Configuração dinâmica de marcas, secretarias e entidades.',
    detailedDescription: 'Possibilidade de cadastrar e alternar entre diferentes marcas, empresas do grupo ou órgãos públicos com bases de dados isoladas.',
    icon: 'Target',
    minPlan: 'starter'
  },
  {
    id: 'S06',
    code: 'radar-varredura-automatica',
    name: 'Radar de Varredura Automatizada',
    category: 'listening',
    categoryLabel: 'Escuta Ativa',
    shortDescription: 'Frequência ajustável de rastreamento com varredura contínua.',
    detailedDescription: 'Robô de escuta com intervalos programáveis (de diário até tempo real em sub-segundos no plano Enterprise).',
    icon: 'Radar',
    minPlan: 'starter'
  },
  {
    id: 'S07',
    code: 'nuvem-termos-sensiveis',
    name: 'Rastreamento de Termos Sensíveis & Hashtags',
    category: 'listening',
    categoryLabel: 'Escuta Ativa',
    shortDescription: 'Vigilância de palavras de risco (Procon, vazamentos, trânsito).',
    detailedDescription: 'Cruzamento semântico com dicionário dinâmico de termos de risco, marcas concorrentes e trending topics locais.',
    icon: 'Hash',
    minPlan: 'starter'
  },
  {
    id: 'S08',
    code: 'benchmarking-concorrentes',
    name: 'Benchmarking de Concorrentes & Share of Voice',
    category: 'listening',
    categoryLabel: 'Escuta Ativa',
    shortDescription: 'Comparativo de reputação, volume e sentimento contra o mercado.',
    detailedDescription: 'Visão comparada de Health Score, penetração de mídia e percepção de marca contra players rivais ou cidades-irmãs.',
    icon: 'BarChart3',
    minPlan: 'pro'
  },
  {
    id: 'S09',
    code: 'ai-executive-reports',
    name: 'Relatórios Executivos de IA (AI Insights)',
    category: 'ai',
    categoryLabel: 'Inteligência Artificial',
    shortDescription: 'Diagnósticos e sumários de narrativa gerados com IA generativa.',
    detailedDescription: 'Geração automatizada de relatórios com os principais impulsionadores do dia, avaliação de risco e plano de ação estratégico.',
    icon: 'FileText',
    minPlan: 'starter',
    isPopular: true
  },
  {
    id: 'S10',
    code: 'notificacoes-push-whatsapp',
    name: 'Notificações Imediatas no WhatsApp/Telegram',
    category: 'integration',
    categoryLabel: 'Integrações',
    shortDescription: 'Disparo de alertas de crise no celular do comitê de decisão.',
    detailedDescription: 'Integração via webhook direto para grupos de gestão de crise com link rápido para o incidente.',
    icon: 'BellRing',
    minPlan: 'enterprise'
  },
  {
    id: 'S11',
    code: 'gestao-equipe-multi-usuarios',
    name: 'Gestão de Equipe & Permissões por Papel',
    category: 'governance',
    categoryLabel: 'Governança',
    shortDescription: 'Controle de acesso para administradores, analistas e auditores.',
    detailedDescription: 'Painel administrativo com logs de auditoria M.E.L.T., redefinição de senhas e bloqueio de privilégios.',
    icon: 'Users',
    minPlan: 'pro'
  },
  {
    id: 'S12',
    code: 'exportacao-dossies-clipping',
    name: 'Exportação de Dossiês & Clipping Executivo',
    category: 'governance',
    categoryLabel: 'Governança',
    shortDescription: 'Downloads em PDF diagramado, planilhas CSV e relatórios para diretoria.',
    detailedDescription: 'Exportação com identidade visual corporativa para apresentações executivas e comitês de crise.',
    icon: 'Download',
    minPlan: 'pro'
  }
];

// Planos Oficiais da Plataforma
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Ideal para marcas individuais, profissionais autônomos e pequenos negócios.',
    priceMonthly: 297,
    priceAnnualMonthly: 237,
    billingPeriod: '/mês',
    limits: {
      maxBrands: 1,
      monthlyMentionsLimit: 5000,
      monitoredChannels: ['instagram', 'twitter', 'news'],
      scanIntervalMinutes: 120, // 2 horas
      maxAlertsActive: 2,
      maxTeamMembers: 1,
      hasVideoAudioTranscription: false,
      hasPredictiveCrisisAI: false,
      hasWhatsAppAlerts: false,
      hasCustomCompetitors: false,
      hasExecutiveReportsPdf: false,
      hasDedicatedSupportSLA: false
    },
    highlightedFeatures: [
      '1 Alvo / Marca Monitorada',
      'Até 5.000 menções indexadas/mês',
      '3 Canais Sociais (Instagram, X, Notícias)',
      'Varredura automática a cada 2 horas',
      'Análise de Sentimento com IA',
      'Painel Radar Executivo',
      'Relatórios Mensais de IA'
    ],
    serviceCodes: ['S01', 'S03', 'S04', 'S05', 'S06', 'S07', 'S09']
  },
  {
    id: 'pro',
    name: 'Professional',
    tagline: 'Para agências, médias empresas e marcas com presença digital ativa.',
    priceMonthly: 790,
    priceAnnualMonthly: 630,
    billingPeriod: '/mês',
    badge: 'Mais Popular',
    isFeatured: true,
    limits: {
      maxBrands: 3,
      monthlyMentionsLimit: 50000,
      monitoredChannels: ['instagram', 'tiktok', 'twitter', 'youtube', 'news', 'reddit'],
      scanIntervalMinutes: 15, // 15 minutos
      maxAlertsActive: 10,
      maxTeamMembers: 3,
      hasVideoAudioTranscription: true,
      hasPredictiveCrisisAI: true,
      hasWhatsAppAlerts: false,
      hasCustomCompetitors: true,
      hasExecutiveReportsPdf: true,
      hasDedicatedSupportSLA: false
    },
    highlightedFeatures: [
      '3 Alvos / Marcas Simultâneas',
      'Até 50.000 menções indexadas/mês',
      'Todos os 6 Canais (com TikTok e YouTube)',
      'Radar Rápido (varreduras a cada 15 min)',
      'Transcrição Multimodal de Áudio/Vídeo com IA',
      'Central de Crises com Alertas Ilimitados',
      'Benchmarking com 3 Rivais de Mercado',
      'Relatórios Semanais de IA + Exportação PDF',
      'Até 3 Usuários de Equipe'
    ],
    serviceCodes: ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S11', 'S12']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Corporações, grandes indústrias e marcas que exigem monitoramento em tempo real.',
    priceMonthly: 1890,
    priceAnnualMonthly: 1510,
    billingPeriod: '/mês',
    badge: 'Poder Máximo',
    limits: {
      maxBrands: 10,
      monthlyMentionsLimit: 250000,
      monitoredChannels: ['instagram', 'tiktok', 'twitter', 'youtube', 'news', 'reddit'],
      scanIntervalMinutes: 1, // Tempo Real
      maxAlertsActive: 999,
      maxTeamMembers: 15,
      hasVideoAudioTranscription: true,
      hasPredictiveCrisisAI: true,
      hasWhatsAppAlerts: true,
      hasCustomCompetitors: true,
      hasExecutiveReportsPdf: true,
      hasDedicatedSupportSLA: true
    },
    highlightedFeatures: [
      '10 Alvos / Marcas Monitoradas',
      'Até 250.000+ menções indexadas/mês',
      'Radar em Tempo Real Contínuo (1 min)',
      'IA Preditiva Avançada & Análise de Emoções',
      'Alertas Críticos Imediatos no WhatsApp/Telegram',
      'Benchmarking Completo e Ilimitado',
      'Relatórios Executivos Diários & On-Demand',
      'Até 15 Usuários com Gestão Admin',
      'SLA de Suporte Prioritário 24/7'
    ],
    serviceCodes: ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12']
  },
  {
    id: 'governo',
    name: 'Governo & Smart City',
    tagline: 'Centros de Operações Integradas, Prefeituras, Defesa Civil e Secretarias de Estado.',
    priceMonthly: 4900,
    priceAnnualMonthly: 3900,
    billingPeriod: '/mês',
    badge: 'Institucional',
    isCustomPrice: true,
    limits: {
      maxBrands: 25,
      monthlyMentionsLimit: 1000000,
      monitoredChannels: ['instagram', 'tiktok', 'twitter', 'youtube', 'news', 'reddit'],
      scanIntervalMinutes: 1,
      maxAlertsActive: 999,
      maxTeamMembers: 50,
      hasVideoAudioTranscription: true,
      hasPredictiveCrisisAI: true,
      hasWhatsAppAlerts: true,
      hasCustomCompetitors: true,
      hasExecutiveReportsPdf: true,
      hasDedicatedSupportSLA: true
    },
    highlightedFeatures: [
      'Múltiplos Órgãos (Trânsito, Defesa Civil, Saúde, Ouvidoria)',
      'Varredura de Ocorrências Urbanas e Climáticas em Tempo Real',
      'Rastreamento Geolocalizado de Alagamentos e Tráfego',
      'Playbooks de Resposta a Desastres e Comunicação Pública',
      'Usuários Ilimitados para Agentes e Centrais de Controle',
      'Treinamento e Implantação Dedicada'
    ],
    serviceCodes: ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12']
  }
];
