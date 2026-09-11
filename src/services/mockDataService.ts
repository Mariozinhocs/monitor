import { Mention, CrisisAlert, BrandOverview, SocialChannel, SentimentType, RiskLevel } from '../types/monitor';
import { BrandMonitorConfig } from '../components/settings/BrandMonitorSetupModal';

export interface TopicItem {
  name: string;
  count: number;
  sentiment: SentimentType;
  growth: string;
}

export interface VolumePoint {
  time: string;
  volume: number;
  positive: number;
  negative: number;
  critical: number;
}

export interface ChannelStat {
  id: SocialChannel;
  name: string;
  count: number;
  percent: number;
  color: string;
  barBg: string;
}

export const DEFAULT_MONITOR_CONFIG: BrandMonitorConfig = {
  brandName: 'Centro de Cooperação da Cidade',
  primaryKeywords: [
    'Centro de Cooperação da Cidade',
    '#MonitoramentoUrbano',
    'CCC Manaus',
    'Defesa Civil',
    'Trânsito & Vias'
  ],
  sensitiveCrisisTerms: [
    'Alagamento',
    'Semáforo Quebrado',
    'Acidente Grave',
    'Deslizamento',
    'Falta de Luz',
    'Interdição'
  ],
  competitors: [
    'Centro de Operações Rio (COR)',
    'CET Trânsito',
    'Central Integrada 190'
  ],
  monitoredChannels: ['instagram', 'tiktok', 'twitter', 'youtube', 'news', 'reddit'],
  alertSensitivity: 'high'
};

export function isPublicSectorOrUrban(brandName: string): boolean {
  const normalized = brandName.toLowerCase();
  return (
    normalized.includes('cidade') ||
    normalized.includes('centro de coop') ||
    normalized.includes('prefeitura') ||
    normalized.includes('governo') ||
    normalized.includes('defesa') ||
    normalized.includes('trânsito') ||
    normalized.includes('transito') ||
    normalized.includes('guarda') ||
    normalized.includes('secretaria') ||
    normalized.includes('cooperação') ||
    normalized.includes('urbano') ||
    normalized.includes('samu')
  );
}

export function generateBrandDataset(config: BrandMonitorConfig) {
  const brandName = config.brandName || 'Centro de Cooperação da Cidade';
  const isUrban = isPublicSectorOrUrban(brandName);

  const keywords = config.primaryKeywords.length > 0
    ? config.primaryKeywords
    : [brandName, `#${brandName.replace(/\s+/g, '')}`, 'Operação', 'Atendimento'];

  const sensitive = config.sensitiveCrisisTerms.length > 0
    ? config.sensitiveCrisisTerms
    : ['Reclamação', 'Instabilidade', 'Denúncia', 'Protesto', 'Urgência'];

  // 1. BRAND OVERVIEW METRICS
  const brand: BrandOverview = {
    brandName,
    reputationScore: isUrban ? 86 : 84,
    totalMentions: isUrban ? 16420 : 14280,
    growthRate24h: isUrban ? 22.4 : 18.5,
    sentimentSplit: isUrban
      ? { positive: 64, neutral: 22, negative: 10, critical: 4 }
      : { positive: 62, neutral: 24, negative: 11, critical: 3 },
    activeCrisisCount: 2,
    estimatedReach: isUrban ? 3200000 : 2850000,
  };

  // 2. CRISIS ALERTS
  let alerts: CrisisAlert[] = [];
  if (isUrban) {
    alerts = [
      {
        id: `alt-${Date.now()}-1`,
        title: `Pico de Menções sobre ${sensitive[0] || 'Alagamento'} e Trânsito no X / Twitter`,
        description: `Moradores e motoristas relatam lentidão acentuada e ponto crítico de retenção na via principal monitorada pelo ${brandName}.`,
        severity: 'critical',
        channel: 'twitter',
        mentionCount: 680,
        negativeRatio: 74,
        triggeredAt: 'Há 15 minutos',
        status: 'active',
        recommendedAction: `Acionar equipe de campo de mobilidade urbana e emitir alerta de desvio nos canais oficiais do ${brandName}.`,
        affectedTopics: [sensitive[0] || 'Alagamento', 'Trânsito', '#AlertaUrbano', 'ViaInterditada'],
      },
      {
        id: `alt-${Date.now()}-2`,
        title: `Detecção de Vídeo no TikTok sobre ${sensitive[1] || 'Semáforo Quebrado'} em Cruzamento Crítico`,
        description: `Publicação com 85 mil visualizações mostrando agentes operacionais atuando em ocorrência de alta prioridade.`,
        severity: 'high',
        channel: 'tiktok',
        mentionCount: 290,
        negativeRatio: 58,
        triggeredAt: 'Há 45 minutos',
        status: 'active',
        recommendedAction: `Atualizar painel de status do portal de transparência e destacar tempo recorde de intervenção das viaturas.`,
        affectedTopics: [sensitive[1] || 'Semáforo', 'Cruzamento', brandName],
      },
      {
        id: `alt-${Date.now()}-3`,
        title: `Repercussão em Fórum Comunitário sobre Iluminação e Segurança Preventiva`,
        description: `Tópico em fórum regional discutindo a ampliação do cerco de câmeras inteligentes e vigilância integrada.`,
        severity: 'medium',
        channel: 'reddit',
        mentionCount: 110,
        negativeRatio: 35,
        triggeredAt: 'Há 2 horas',
        status: 'investigating',
        recommendedAction: 'Consolidar relatório de ocorrências atendidas pela central para envio à assessoria de imprensa.',
        affectedTopics: ['CâmerasInteligentes', 'SegurançaPública', 'Vigilância'],
      }
    ];
  } else {
    alerts = [
      {
        id: `alt-${Date.now()}-1`,
        title: `Pico de Menções Críticas no TikTok sobre ${brandName}`,
        description: `Vídeo com alta taxa de engajamento citando ${sensitive[0] || 'Instabilidade'} e tempo de resposta no atendimento.`,
        severity: 'critical',
        channel: 'tiktok',
        mentionCount: 840,
        negativeRatio: 78,
        triggeredAt: 'Há 18 minutos',
        status: 'active',
        recommendedAction: `Publicar comunicado no perfil oficial e acionar time de suporte para contenção prioritária de ${brandName}.`,
        affectedTopics: [sensitive[0] || 'Bug', 'Atendimento', brandName],
      },
      {
        id: `alt-${Date.now()}-2`,
        title: `Aumento de menções sensíveis no X (Twitter) citando ${sensitive[1] || 'Reclamações'}`,
        description: `Aumento de 42% no volume de tweets de clientes buscando esclarecimentos e suporte rápido.`,
        severity: 'high',
        channel: 'twitter',
        mentionCount: 310,
        negativeRatio: 64,
        triggeredAt: 'Há 1 hora',
        status: 'active',
        recommendedAction: 'Reforçar equipe de primeiro nível e disparar respostas personalizadas nas redes.',
        affectedTopics: [sensitive[1] || 'Suporte', 'Demora', brandName],
      }
    ];
  }

  // 3. MENTIONS FEED
  let mentions: Mention[] = [];
  if (isUrban) {
    mentions = [
      {
        id: `men-${Date.now()}-1`,
        channel: 'twitter',
        author: {
          name: 'Portal Manaus Notícias',
          username: '@portalmanausnoticias',
          avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 320000,
        },
        content: `🚨 O ${brandName} informa que as equipes de pronto-atendimento já estão em campo monitorando as principais avenidas após a chuva forte. Fluxo monitorado 24h via central de inteligência. #OperacaoUrbana #${keywords[0].replace(/\s+/g, '')}`,
        timestamp: 'Há 8 min',
        likes: 1420,
        comments: 115,
        shares: 430,
        sentiment: 'positive',
        sentimentScore: 0.92,
        riskLevel: 'low',
        topics: [keywords[0], '#OperacaoUrbana', 'Monitoramento24h'],
        reachEstimate: 450000,
        aiAnalysis: {
          summary: `Notícia de utilidade pública com alta tração positiva destacando prontidão do ${brandName}.`,
          emotion: 'Aprovação',
          crisisIndicator: false,
          suggestedAction: 'Retuitar pelo canal institucional oficial e fixar orientações de trânsito.',
        }
      },
      {
        id: `men-${Date.now()}-2`,
        channel: 'tiktok',
        author: {
          name: 'Renan Vias & Trânsito',
          username: '@renan_transito',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 94000,
        },
        content: `Olha a situação da rotatória agora! Semáforo intermitente e retenção de veículos. Cadê o suporte do ${brandName} para orientar os motoristas? ⚠️🚗`,
        mediaType: 'video',
        mediaUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80',
        transcription: `[Áudio Transcrito por IA]: "...o tráfego parou aqui na zona central, precisa de agentes do ${brandName} urgente pra organizar a conversão..."`,
        timestamp: 'Há 18 min',
        likes: 3100,
        comments: 420,
        shares: 210,
        sentiment: 'critical',
        sentimentScore: 0.91,
        riskLevel: 'critical',
        topics: [sensitive[0] || 'Semáforo', 'Trânsito', keywords[0]],
        reachEstimate: 180000,
        aiAnalysis: {
          summary: `Vídeo viral denunciando retenção no tráfego com menção direta solicitando intervenção do ${brandName}.`,
          emotion: 'Indignação',
          crisisIndicator: true,
          suggestedAction: `Enviar equipe de agentes imediatamente ao local e responder no comentário informando o atendimento da ocorrência.`,
        }
      },
      {
        id: `men-${Date.now()}-3`,
        channel: 'instagram',
        author: {
          name: 'Mariana Costa',
          username: '@mari_costa_am',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 14200,
        },
        content: `Quero parabenizar o trabalho rápido do ${brandName} e Defesa Civil! Reportei uma queda de galho na minha rua pelo aplicativo e em menos de 40 minutos a equipe desobstruiu a via. Serviço nota 10! 👏🌿`,
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
        timestamp: 'Há 42 min',
        likes: 890,
        comments: 45,
        shares: 28,
        sentiment: 'positive',
        sentimentScore: 0.96,
        riskLevel: 'low',
        topics: ['#AtendimentoAgil', brandName, 'DefesaCivil'],
        reachEstimate: 38000,
        aiAnalysis: {
          summary: 'Elogio espontâneo de cidadã ao tempo de resposta do chamado urbano.',
          emotion: 'Gratidão',
          crisisIndicator: false,
          suggestedAction: 'Curtir e repostar nos stories institucionais como prova social de eficiência.',
        }
      },
      {
        id: `men-${Date.now()}-4`,
        channel: 'news',
        author: {
          name: 'Jornal Diário Metropolitano',
          username: '@diariometropolitano',
          avatar: 'https://images.unsplash.com/photo-1586339949916-3e945abeb6e0?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 890000,
        },
        content: `Reportagem Especial: "Como o ${brandName} utiliza Inteligência Artificial e câmeras de alta resolução para antecipar crises climáticas e otimizar a segurança dos munícipes."`,
        timestamp: 'Há 1 hora',
        likes: 2450,
        comments: 130,
        shares: 620,
        sentiment: 'positive',
        sentimentScore: 0.94,
        riskLevel: 'low',
        topics: [brandName, 'InovaçãoUrbana', 'IA', 'Segurança'],
        reachEstimate: 1200000,
        aiAnalysis: {
          summary: 'Matéria jornalística de alto prestígio validando o investimento em tecnologia preditiva.',
          emotion: 'Reconhecimento',
          crisisIndicator: false,
          suggestedAction: 'Arquivar para o clipping oficial executivo e compartilhar com a equipe de liderança.',
        }
      },
      {
        id: `men-${Date.now()}-5`,
        channel: 'youtube',
        author: {
          name: 'Canal Cidades Inteligentes BR',
          username: '@cidadesinteligentes',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 175000,
        },
        content: `Tour pelo Centro de Controle: Analisamos os sistemas de resposta integrada do ${brandName}. Veja como funciona o cruzamento de dados em tempo real.`,
        mediaType: 'video',
        mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
        transcription: `[Áudio Transcrito por IA]: "...a estrutura do ${brandName} impressiona pela velocidade em cruzar chamados com telemetria das viaturas..."`,
        timestamp: 'Há 3 horas',
        likes: 3800,
        comments: 290,
        shares: 340,
        sentiment: 'positive',
        sentimentScore: 0.93,
        riskLevel: 'low',
        topics: ['#SmartCity', brandName, 'TecnologiaUrbana'],
        reachEstimate: 310000,
        aiAnalysis: {
          summary: 'Review técnico aprofundado com excelente retenção e engajamento da comunidade de tecnologia pública.',
          emotion: 'Aprovação',
          crisisIndicator: false,
          suggestedAction: 'Fixar comentário oficial e disponibilizar canal para contato institucional.',
        }
      }
    ];
  } else {
    mentions = [
      {
        id: `men-${Date.now()}-1`,
        channel: 'twitter',
        author: {
          name: 'Lucas Brandão',
          username: '@lucas_brandao',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 1820,
        },
        content: `Impressionado com o atendimento da equipe da ${brandName}. Resolveram minha solicitação em poucos minutos! 🚀 #${keywords[0].replace(/\s+/g, '')}`,
        timestamp: 'Há 5 min',
        likes: 18,
        comments: 3,
        shares: 2,
        sentiment: 'positive',
        sentimentScore: 0.95,
        riskLevel: 'low',
        topics: [keywords[0], 'Suporte', 'Agilidade'],
        reachEstimate: 3400,
        aiAnalysis: {
          summary: `Elogio direto à agilidade do atendimento de ${brandName}.`,
          emotion: 'Agradecimento',
          crisisIndicator: false,
          suggestedAction: 'Agradecer e curtir post.',
        }
      },
      {
        id: `men-${Date.now()}-2`,
        channel: 'tiktok',
        author: {
          name: 'Tech & Lifestyle Reviews',
          username: '@techlifestyle',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 450000,
        },
        content: `Pessoal, testando os novos recursos da ${brandName} hoje. Tive uma dúvida na integração, mas o time de suporte respondeu rápido.`,
        mediaType: 'video',
        mediaUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80',
        timestamp: 'Há 25 min',
        likes: 2800,
        comments: 180,
        shares: 75,
        sentiment: 'positive',
        sentimentScore: 0.88,
        riskLevel: 'low',
        topics: [brandName, 'Review', 'Novidades'],
        reachEstimate: 210000,
        aiAnalysis: {
          summary: `Review favorável de influenciador com boa base de seguidores sobre ${brandName}.`,
          emotion: 'Interesse',
          crisisIndicator: false,
          suggestedAction: 'Interagir no comentário.',
        }
      }
    ];
  }

  // 4. DYNAMIC TOPIC CLOUD
  const topics: TopicItem[] = [
    { name: keywords[0] || brandName, count: isUrban ? 6240 : 5420, sentiment: 'positive', growth: '+28%' },
    { name: sensitive[0] || (isUrban ? 'Alagamento' : '#BugApp'), count: isUrban ? 2310 : 1890, sentiment: 'critical', growth: '+125%' },
    { name: keywords[1] || (isUrban ? '#TrânsitoSeguro' : 'IA Preditiva'), count: isUrban ? 1980 : 1650, sentiment: 'positive', growth: '+42%' },
    { name: sensitive[1] || (isUrban ? 'Semáforos' : 'Suporte & Chat'), count: isUrban ? 1420 : 1120, sentiment: 'negative', growth: '+15%' },
    { name: keywords[2] || (isUrban ? 'Defesa Civil' : 'Atualização V2'), count: isUrban ? 1350 : 980, sentiment: 'positive', growth: '+35%' },
    { name: sensitive[2] || (isUrban ? 'Ocorrências' : 'Reclamações'), count: isUrban ? 890 : 410, sentiment: 'critical', growth: '+65%' },
    { name: keywords[3] || (isUrban ? '#CidadeInteligente' : '#InovaçãoTech'), count: isUrban ? 1120 : 820, sentiment: 'positive', growth: '+20%' },
  ];

  // 5. MULTICHANNEL DISTRIBUTION
  const channelList: ChannelStat[] = [
    { id: 'instagram', name: 'Instagram', count: isUrban ? 5400 : 4820, percent: 33, color: 'text-pink-400', barBg: 'bg-pink-500' },
    { id: 'tiktok', name: 'TikTok', count: isUrban ? 3950 : 3560, percent: 24, color: 'text-cyan-400', barBg: 'bg-cyan-500' },
    { id: 'twitter', name: 'X / Twitter', count: isUrban ? 3820 : 2840, percent: 23, color: 'text-sky-400', barBg: 'bg-sky-500' },
    { id: 'youtube', name: 'YouTube', count: isUrban ? 1820 : 1710, percent: 11, color: 'text-red-400', barBg: 'bg-red-500' },
    { id: 'news', name: 'Portais & Notícias', count: isUrban ? 980 : 850, percent: 6, color: 'text-emerald-400', barBg: 'bg-emerald-500' },
    { id: 'reddit', name: 'Reddit & Fóruns', count: isUrban ? 450 : 500, percent: 3, color: 'text-orange-400', barBg: 'bg-orange-500' },
  ];

  // Filter channels based on monitored config
  const filteredChannels = channelList.filter(ch => config.monitoredChannels.includes(ch.id));
  const totalPostCount = filteredChannels.reduce((acc, c) => acc + c.count, 0);
  const channels = filteredChannels.map(c => ({
    ...c,
    percent: totalPostCount > 0 ? Math.round((c.count / totalPostCount) * 100) : c.percent
  }));

  // 6. VOLUME TIMELINE
  const timeline: VolumePoint[] = [
    { time: '00:00', volume: 160, positive: 110, negative: 25, critical: 3 },
    { time: '03:00', volume: 90, positive: 65, negative: 15, critical: 2 },
    { time: '06:00', volume: 340, positive: 220, negative: 50, critical: 8 },
    { time: '09:00', volume: 1050, positive: 710, negative: 160, critical: 20 },
    { time: '12:00', volume: 1680, positive: 1090, negative: 280, critical: 42 },
    { time: '14:00', volume: 2450, positive: 1350, negative: 540, critical: 110 }, // Anomaly peak
    { time: '16:00', volume: 1980, positive: 1220, negative: 390, critical: 55 },
    { time: '18:00', volume: 1540, positive: 1060, negative: 240, critical: 25 },
  ];

  return {
    brand,
    alerts,
    mentions,
    topics,
    channels,
    timeline
  };
}

export function generateLiveScanMention(config: BrandMonitorConfig): Mention {
  const brandName = config.brandName || 'Centro de Cooperação da Cidade';
  const isUrban = isPublicSectorOrUrban(brandName);
  const keyword = config.primaryKeywords[0] || brandName;

  if (isUrban) {
    const liveSamples: Mention[] = [
      {
        id: `men-live-${Date.now()}`,
        channel: 'twitter',
        author: {
          name: 'Carlos Eduardo Trânsito',
          username: '@carlosedu_am',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 2400,
        },
        content: `Acabei de passar pela Avenida Constantino Nery e a equipe do ${brandName} já sinalizou o desvio preventivo. Trânsito fluindo bem! Parabéns pela rapidez. 👏🚦 #${keyword.replace(/\s+/g, '')}`,
        timestamp: 'Agora mesmo',
        likes: 24,
        comments: 3,
        shares: 5,
        sentiment: 'positive',
        sentimentScore: 0.97,
        riskLevel: 'low',
        topics: [keyword, '#TrânsitoFluindo', 'Agilidade'],
        reachEstimate: 4500,
        aiAnalysis: {
          summary: `Feedback positivo em tempo real elogiando prontidão operacional do ${brandName}.`,
          emotion: 'Agradecimento',
          crisisIndicator: false,
          suggestedAction: 'Interagir e monitorar fluxo na região.',
        }
      },
      {
        id: `men-live-${Date.now()}`,
        channel: 'instagram',
        author: {
          name: 'Comunidade Zona Sul',
          username: '@comunidade_zonasul',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 16800,
        },
        content: `Alerta aos moradores: Câmeras de monitoramento do ${brandName} identificaram início de retenção na bifurcação. Evitem o trecho nas próximas horas. 🌧️⚠️`,
        timestamp: 'Agora mesmo',
        likes: 85,
        comments: 12,
        shares: 34,
        sentiment: 'neutral',
        sentimentScore: 0.75,
        riskLevel: 'medium',
        topics: [brandName, 'AlertaPreventivo', 'Mobilidade'],
        reachEstimate: 22000,
        aiAnalysis: {
          summary: 'Aviso comunitário preventivo replicando orientações da central.',
          emotion: 'Alerta',
          crisisIndicator: false,
          suggestedAction: 'Manter vigilância ativa na região.',
        }
      }
    ];
    return liveSamples[Math.floor(Math.random() * liveSamples.length)];
  }

  return {
    id: `men-live-${Date.now()}`,
    channel: 'twitter',
    author: {
      name: 'Eduardo Silveira',
      username: '@edu_silveira',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      verified: false,
      followersCount: 3100,
    },
    content: `Muito bom ver a evolução da ${brandName}. Atendimento rápido e equipe super prestativa! 🚀👏 #${keyword.replace(/\s+/g, '')}`,
    timestamp: 'Agora mesmo',
    likes: 19,
    comments: 2,
    shares: 4,
    sentiment: 'positive',
    sentimentScore: 0.95,
    riskLevel: 'low',
    topics: [keyword, '#SuporteNota10', 'Inovação'],
    reachEstimate: 5200,
    aiAnalysis: {
      summary: `Elogio direto ao tempo de resposta e qualidade da ${brandName}.`,
      emotion: 'Agradecimento',
      crisisIndicator: false,
      suggestedAction: 'Curtir e responder agradecendo a confiança.',
    }
  };
}

// Initial default exports for backwards compatibility
export const INITIAL_DATASET = generateBrandDataset(DEFAULT_MONITOR_CONFIG);
export const INITIAL_BRAND = INITIAL_DATASET.brand;
export const INITIAL_ALERTS = INITIAL_DATASET.alerts;
export const INITIAL_MENTIONS = INITIAL_DATASET.mentions;
export const TOPICS_DATA = INITIAL_DATASET.topics;
export const VOLUME_TIMELINE_DATA = INITIAL_DATASET.timeline;
