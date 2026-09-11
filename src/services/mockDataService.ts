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
  brandName: 'Mario Henrique (@mariozinhocs)',
  primaryKeywords: [
    '@mariozinhocs',
    'Mario Henrique',
    '#mariozinhocs',
    'Sentinela AI',
    'Dev Squad A-Team'
  ],
  sensitiveCrisisTerms: [
    'Crítica',
    'Fake News',
    'Golpe',
    'Reclamação',
    'Instabilidade',
    'Vulnerabilidade'
  ],
  competitors: [
    'Tech Influencers BR',
    'Startups de IA',
    'Dev Community'
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
    normalized.includes('defesa civil') ||
    normalized.includes('trânsito') ||
    normalized.includes('transito') ||
    normalized.includes('guarda') ||
    normalized.includes('secretaria') ||
    normalized.includes('cooperação') ||
    normalized.includes('urbano') ||
    normalized.includes('samu')
  );
}

export function isPersonalProfile(brandName: string): boolean {
  const normalized = brandName.toLowerCase();
  return (
    normalized.includes('mario') ||
    normalized.includes('mariozinhocs') ||
    normalized.includes('@') ||
    normalized.includes('henrique') ||
    normalized.includes('perfil') ||
    normalized.includes('dev') ||
    normalized.includes('consultor') ||
    normalized.includes('lider') ||
    normalized.includes('líder')
  );
}

export function generateBrandDataset(config?: Partial<BrandMonitorConfig> | null) {
  const brandName = config?.brandName || 'Mario Henrique (@mariozinhocs)';
  const isUrban = isPublicSectorOrUrban(brandName);
  const isPersonal = isPersonalProfile(brandName);

  const keywords = (Array.isArray(config?.primaryKeywords) && config!.primaryKeywords.length > 0)
    ? config!.primaryKeywords
    : [brandName, `@${brandName.replace(/\s+/g, '')}`, '#SentinelaAI', 'Inovação'];

  const sensitive = (Array.isArray(config?.sensitiveCrisisTerms) && config!.sensitiveCrisisTerms.length > 0)
    ? config!.sensitiveCrisisTerms
    : ['Crítica', 'Fake News', 'Reclamação', 'Golpe', 'Vulnerabilidade'];

  const activeChannels = (Array.isArray(config?.monitoredChannels) && config!.monitoredChannels.length > 0)
    ? config!.monitoredChannels
    : ['instagram', 'tiktok', 'twitter', 'youtube', 'news', 'reddit'];

  // 1. BRAND OVERVIEW METRICS
  const brand: BrandOverview = {
    brandName,
    reputationScore: isUrban ? 86 : (isPersonal ? 94 : 88),
    totalMentions: isUrban ? 16420 : (isPersonal ? 8940 : 12350),
    growthRate24h: isUrban ? 22.4 : (isPersonal ? 34.8 : 18.5),
    sentimentSplit: isPersonal
      ? { positive: 82, neutral: 12, negative: 4, critical: 2 }
      : (isUrban
          ? { positive: 64, neutral: 22, negative: 10, critical: 4 }
          : { positive: 70, neutral: 20, negative: 7, critical: 3 }),
    activeCrisisCount: isPersonal ? 0 : 2,
    estimatedReach: isPersonal ? 1450000 : (isUrban ? 3200000 : 2100000),
  };

  // 2. CRISIS ALERTS
  let alerts: CrisisAlert[] = [];
  if (isPersonal) {
    alerts = [
      {
        id: `alt-${Date.now()}-1`,
        title: `Menção em alta no Instagram sobre Arquitetura e Inovação do Sentinela.ai`,
        description: `Carrossel técnico publicado marcando @mariozinhocs atingiu pico de compartilhamentos e comentários positivos de desenvolvedores e gestores.`,
        severity: 'low',
        channel: 'instagram',
        mentionCount: 420,
        negativeRatio: 3,
        triggeredAt: 'Há 12 minutos',
        status: 'active',
        recommendedAction: `Interagir nos comentários e republicar nos stories para ampliar autoridade técnica.`,
        affectedTopics: ['@mariozinhocs', 'SentinelaAI', '#TechLead', 'Inovação'],
      },
      {
        id: `alt-${Date.now()}-2`,
        title: `Radar Preventivo: Tentativa de uso indevido de imagem / perfil similar`,
        description: `Algoritmo anti-phishing detectou conta recente com username similar monitorado por precaução.`,
        severity: 'medium',
        channel: 'instagram',
        mentionCount: 15,
        negativeRatio: 45,
        triggeredAt: 'Há 1 hora',
        status: 'investigating',
        recommendedAction: 'Manter monitoramento de marca ativo e verificar selo de verificação.',
        affectedTopics: ['Segurança', '@mariozinhocs', 'ProteçãoDeMarca'],
      }
    ];
  } else if (isUrban) {
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
      }
    ];
  } else {
    alerts = [
      {
        id: `alt-${Date.now()}-1`,
        title: `Pico de Menções no TikTok sobre ${brandName}`,
        description: `Vídeo com alta taxa de engajamento citando ${sensitive[0] || 'Instabilidade'} e tempo de resposta.`,
        severity: 'high',
        channel: 'tiktok',
        mentionCount: 410,
        negativeRatio: 62,
        triggeredAt: 'Há 18 minutos',
        status: 'active',
        recommendedAction: `Publicar comunicado no perfil oficial e acionar time de atendimento de ${brandName}.`,
        affectedTopics: [sensitive[0] || 'Atendimento', brandName],
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
  } else if (isPersonal) {
    mentions = [
      {
        id: `men-${Date.now()}-1`,
        channel: 'instagram',
        author: {
          name: 'Comunidade Tech Brasil',
          username: '@comunidade_tech_br',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 128000,
        },
        content: `Impressionante a nova arquitetura de social listening e IA semântica liderada pelo @mariozinhocs no Sentinela.ai! O sistema processa menções em milissegundos e antecipa crises com precisão cirúrgica. Parabéns pelo projeto! 🚀🔥 #TechLead #IA #DevSquad #SentinelaAI`,
        mediaType: 'video',
        mediaUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80',
        transcription: `[Áudio do Reel]: "...dá uma olhada no dashboard que o Mario Henrique e a equipe construíram. A fluidez da interface e a classificação de sentimentos em tempo real estão fantásticas..."`,
        timestamp: 'Há 4 min',
        likes: 1840,
        comments: 142,
        shares: 215,
        sentiment: 'positive',
        sentimentScore: 0.98,
        riskLevel: 'low',
        topics: ['@mariozinhocs', 'SentinelaAI', '#TechLead', 'Inovação'],
        reachEstimate: 245000,
        aiAnalysis: {
          summary: 'Reel de alta repercussão com forte aprovação da comunidade dev validando a liderança técnica e o Sentinela.ai.',
          emotion: 'Aprovação',
          crisisIndicator: false,
          suggestedAction: 'Agradecer nos comentários e repostar nos stories para fortalecer autoridade de mercado.',
        }
      },
      {
        id: `men-${Date.now()}-2`,
        channel: 'instagram',
        author: {
          name: 'Gabriel Albuquerque',
          username: '@gabriel_albuquerque_tech',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 18500,
        },
        content: `Testando em primeira mão o módulo de escuta aberta do Instagram desenvolvido pelo @mariozinhocs. A velocidade de indexação e a análise de risco são impressionantes. 👏⚡ #Inovacao #SocialListening`,
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
        timestamp: 'Há 18 min',
        likes: 620,
        comments: 48,
        shares: 31,
        sentiment: 'positive',
        sentimentScore: 0.96,
        riskLevel: 'low',
        topics: ['@mariozinhocs', 'EscutaAtiva', 'SocialListening'],
        reachEstimate: 42000,
        aiAnalysis: {
          summary: 'Elogio espontâneo destacando agilidade e tecnologia do módulo de escuta ativa.',
          emotion: 'Reconhecimento',
          crisisIndicator: false,
          suggestedAction: 'Curtir a publicação e enviar mensagem de agradecimento.',
        }
      },
      {
        id: `men-${Date.now()}-3`,
        channel: 'twitter',
        author: {
          name: 'Dev Insider BR',
          username: '@dev_insider',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 84000,
        },
        content: `Acompanhando o trabalho do @mariozinhocs no desenvolvimento de soluções autônomas e painéis de alta fidelidade. O padrão de engenharia de software empregado é referência! 💻💡 #FullStack #SoftwareEngineering`,
        timestamp: 'Há 45 min',
        likes: 310,
        comments: 24,
        shares: 56,
        sentiment: 'positive',
        sentimentScore: 0.95,
        riskLevel: 'low',
        topics: ['@mariozinhocs', 'EngenhariaDeSoftware', 'DevSquad'],
        reachEstimate: 95000,
        aiAnalysis: {
          summary: 'Publicação no X destacando excelência em engenharia e consistência técnica.',
          emotion: 'Admiração',
          crisisIndicator: false,
          suggestedAction: 'Retuitar e fixar no perfil.',
        }
      },
      {
        id: `men-${Date.now()}-4`,
        channel: 'youtube',
        author: {
          name: 'Canal Arquitetura & Código',
          username: '@arquitetura_codigo',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 160000,
        },
        content: `Review Completo: "Análise Técnica da Plataforma Sentinela.ai construída por Mario Henrique (@mariozinhocs) - O que torna esse radar de IA tão veloz?"`,
        mediaType: 'video',
        mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
        transcription: `[Áudio Transcrito por IA]: "...o pipeline criado pelo Mario Henrique combina uma interface reativa em React com análise preditiva e coletores sob demanda, permitindo escalar sem sobrecarregar a infra..."`,
        timestamp: 'Há 2 horas',
        likes: 2900,
        comments: 185,
        shares: 140,
        sentiment: 'positive',
        sentimentScore: 0.94,
        riskLevel: 'low',
        topics: ['@mariozinhocs', 'Arquitetura', 'SentinelaAI', 'Review'],
        reachEstimate: 180000,
        aiAnalysis: {
          summary: 'Conteúdo aprofundado no YouTube validando autoridade técnica e desempenho do produto.',
          emotion: 'Aprovação',
          crisisIndicator: false,
          suggestedAction: 'Comentar no vídeo agradecendo a cobertura e compartilhar com o squad.',
        }
      },
      {
        id: `men-${Date.now()}-5`,
        channel: 'news',
        author: {
          name: 'Tech Portal Daily',
          username: '@techportaldaily',
          avatar: 'https://images.unsplash.com/photo-1586339949916-3e945abeb6e0?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 450000,
        },
        content: `Artigo Especial: "Como ferramentas de gestão de risco e social listening como o Sentinela.ai estão transformando a tomada de decisão de executivos e lideranças."`,
        timestamp: 'Há 3 horas',
        likes: 1200,
        comments: 65,
        shares: 310,
        sentiment: 'positive',
        sentimentScore: 0.92,
        riskLevel: 'low',
        topics: ['SentinelaAI', 'SocialListening', 'Inovação'],
        reachEstimate: 620000,
        aiAnalysis: {
          summary: 'Matéria na imprensa especializada validando a tese de mercado da plataforma.',
          emotion: 'Interesse',
          crisisIndicator: false,
          suggestedAction: 'Incluir no clipping executivo de assessoria.',
        }
      }
    ];
  } else {
    mentions = [
      {
        id: `men-${Date.now()}-1`,
        channel: 'instagram',
        author: {
          name: 'Lucas Brandão',
          username: '@lucas_brandao',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 1820,
        },
        content: `Impressionado com a qualidade dos serviços da ${brandName}. Resolveram minha solicitação em poucos minutos! 🚀 #${keywords[0].replace(/\s+/g, '')}`,
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
          summary: `Elogio direto à agilidade de ${brandName}.`,
          emotion: 'Agradecimento',
          crisisIndicator: false,
          suggestedAction: 'Agradecer e curtir post.',
        }
      },
      {
        id: `men-${Date.now()}-2`,
        channel: 'tiktok',
        author: {
          name: 'Tech & Reviews',
          username: '@techreviews',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 450000,
        },
        content: `Testando os novos recursos da ${brandName} hoje. Experiência super fluida! 🔥`,
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
          summary: `Review favorável de criador de conteúdo sobre ${brandName}.`,
          emotion: 'Interesse',
          crisisIndicator: false,
          suggestedAction: 'Interagir no comentário.',
        }
      }
    ];
  }

  // 4. DYNAMIC TOPIC CLOUD
  const topics: TopicItem[] = isPersonal
    ? [
        { name: '@mariozinhocs', count: 4850, sentiment: 'positive', growth: '+45%' },
        { name: 'SentinelaAI', count: 3420, sentiment: 'positive', growth: '+62%' },
        { name: 'EngenhariaDeSoftware', count: 2190, sentiment: 'positive', growth: '+28%' },
        { name: '#TechLead', count: 1850, sentiment: 'positive', growth: '+35%' },
        { name: 'IA Preditiva', count: 1420, sentiment: 'positive', growth: '+50%' },
        { name: 'FullStack', count: 980, sentiment: 'positive', growth: '+18%' },
        { name: 'Inovação Digital', count: 870, sentiment: 'positive', growth: '+22%' },
      ]
    : [
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
    { id: 'instagram', name: 'Instagram', count: isPersonal ? 4100 : (isUrban ? 5400 : 4820), percent: isPersonal ? 46 : 33, color: 'text-pink-400', barBg: 'bg-pink-500' },
    { id: 'tiktok', name: 'TikTok', count: isPersonal ? 1200 : (isUrban ? 3950 : 3560), percent: isPersonal ? 14 : 24, color: 'text-cyan-400', barBg: 'bg-cyan-500' },
    { id: 'twitter', name: 'X / Twitter', count: isPersonal ? 2350 : (isUrban ? 3820 : 2840), percent: isPersonal ? 26 : 23, color: 'text-sky-400', barBg: 'bg-sky-500' },
    { id: 'youtube', name: 'YouTube', count: isPersonal ? 890 : (isUrban ? 1820 : 1710), percent: isPersonal ? 10 : 11, color: 'text-red-400', barBg: 'bg-red-500' },
    { id: 'news', name: 'Portais & Notícias', count: isPersonal ? 320 : (isUrban ? 980 : 850), percent: isPersonal ? 3 : 6, color: 'text-emerald-400', barBg: 'bg-emerald-500' },
    { id: 'reddit', name: 'Reddit & Fóruns', count: isPersonal ? 80 : (isUrban ? 450 : 500), percent: isPersonal ? 1 : 3, color: 'text-orange-400', barBg: 'bg-orange-500' },
  ];

  // Filter channels based on monitored config
  const filteredChannels = channelList.filter(ch => activeChannels.includes(ch.id));
  const totalPostCount = filteredChannels.reduce((acc, c) => acc + c.count, 0);
  const channels = filteredChannels.map(c => ({
    ...c,
    percent: totalPostCount > 0 ? Math.round((c.count / totalPostCount) * 100) : c.percent
  }));

  // 6. VOLUME TIMELINE
  const timeline: VolumePoint[] = [
    { time: '00:00', volume: 160, positive: 130, negative: 15, critical: 1 },
    { time: '03:00', volume: 90, positive: 75, negative: 10, critical: 1 },
    { time: '06:00', volume: 340, positive: 280, negative: 20, critical: 2 },
    { time: '09:00', volume: 1050, positive: 880, negative: 60, critical: 5 },
    { time: '12:00', volume: 1680, positive: 1420, negative: 90, critical: 8 },
    { time: '14:00', volume: 2450, positive: 2100, negative: 140, critical: 12 },
    { time: '16:00', volume: 1980, positive: 1720, negative: 110, critical: 9 },
    { time: '18:00', volume: 1540, positive: 1350, negative: 70, critical: 4 },
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
  const brandName = config.brandName || 'Mario Henrique (@mariozinhocs)';
  const isUrban = isPublicSectorOrUrban(brandName);
  const isPersonal = isPersonalProfile(brandName);
  const keyword = config.primaryKeywords[0] || brandName;

  if (isPersonal) {
    const personalLiveSamples: Mention[] = [
      {
        id: `men-live-${Date.now()}-1`,
        channel: 'instagram',
        author: {
          name: 'Comunidade Dev Manaus',
          username: '@dev_manaus_oficial',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 42000,
        },
        content: `Acabou de sair nos stories: @mariozinhocs apresentando as novas features do Sentinela.ai com escuta aberta para o Instagram! Parabéns pela inovação. 🚀👏 #${keyword.replace(/[@\s]/g, '')} #IA`,
        timestamp: 'Agora mesmo',
        likes: 95,
        comments: 14,
        shares: 22,
        sentiment: 'positive',
        sentimentScore: 0.99,
        riskLevel: 'low',
        topics: [keyword, 'SentinelaAI', '#DevManaus'],
        reachEstimate: 18000,
        aiAnalysis: {
          summary: 'Menção em tempo real celebrando novidades apresentadas pelo perfil de Mario Henrique.',
          emotion: 'Entusiasmo',
          crisisIndicator: false,
          suggestedAction: 'Interagir e repostar nos stories.',
        }
      },
      {
        id: `men-live-${Date.now()}-2`,
        channel: 'instagram',
        author: {
          name: 'Renata Albuquerque',
          username: '@renata_albuquerque_tech',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 15400,
        },
        content: `Dica de ouro pra quem trabalha com gestão de crises e monitoramento: sigam o trabalho do @mariozinhocs! A visão de produto e automação é sensacional. 💡🔥`,
        timestamp: 'Agora mesmo',
        likes: 120,
        comments: 18,
        shares: 30,
        sentiment: 'positive',
        sentimentScore: 0.98,
        riskLevel: 'low',
        topics: [keyword, '#TechLeadership', 'Inovação'],
        reachEstimate: 21000,
        aiAnalysis: {
          summary: 'Recomendação orgânica de perfil com alto engajamento no Instagram.',
          emotion: 'Reconhecimento',
          crisisIndicator: false,
          suggestedAction: 'Curtir e agradecer nos comentários.',
        }
      }
    ];
    return personalLiveSamples[Math.floor(Math.random() * personalLiveSamples.length)];
  }

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
      }
    ];
    return liveSamples[Math.floor(Math.random() * liveSamples.length)];
  }

  return {
    id: `men-live-${Date.now()}`,
    channel: 'instagram',
    author: {
      name: 'Lucas Brandão',
      username: '@lucas_brandao',
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
