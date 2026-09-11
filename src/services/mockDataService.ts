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
  brandName: 'Nubank',
  primaryKeywords: [
    'Nubank',
    '#Nubank',
    '@nubank',
    'NuBank Cartão',
    'Nucoin',
    'Conta PJ'
  ],
  sensitiveCrisisTerms: [
    'Instabilidade',
    'PIX fora do ar',
    'Fraude',
    'Golpe',
    'Bloqueio de conta',
    'Reclamação'
  ],
  competitors: [
    'Banco Inter',
    'C6 Bank',
    'PicPay',
    'Itaú'
  ],
  monitoredChannels: ['instagram', 'tiktok', 'twitter', 'youtube', 'news', 'reddit'],
  alertSensitivity: 'high'
};

export function isFintechOrBank(brandName: string): boolean {
  const n = brandName.toLowerCase();
  return (
    n.includes('nubank') ||
    n.includes('nu ') ||
    n.includes('inter') ||
    n.includes('itaú') ||
    n.includes('itau') ||
    n.includes('bradesco') ||
    n.includes('santander') ||
    n.includes('banco') ||
    n.includes('bank') ||
    n.includes('c6') ||
    n.includes('picpay') ||
    n.includes('pagbank') ||
    n.includes('mercado pago') ||
    n.includes('fintech') ||
    n.includes('financeiro') ||
    n.includes('cartão') ||
    n.includes('cartao')
  );
}

export function isPublicSectorOrUrban(brandName: string): boolean {
  const n = brandName.toLowerCase();
  return (
    n.includes('cidade') ||
    n.includes('centro de coop') ||
    n.includes('prefeitura') ||
    n.includes('governo') ||
    n.includes('defesa civil') ||
    n.includes('trânsito') ||
    n.includes('transito') ||
    n.includes('guarda') ||
    n.includes('secretaria') ||
    n.includes('cooperação') ||
    n.includes('urbano') ||
    n.includes('samu') ||
    n.includes('david almeida') ||
    n.includes('davidalmeida') ||
    n.includes('manaus') ||
    n.includes('prefeito') ||
    n.includes('governador') ||
    n.includes('estado')
  );
}

export function isPersonalProfile(brandName: string): boolean {
  const n = brandName.toLowerCase();
  return (
    n.includes('mariozinhocs') ||
    (n.includes('mario') && n.includes('henrique')) ||
    n.startsWith('@mario')
  );
}

export function generateBrandDataset(config?: Partial<BrandMonitorConfig> | null) {
  const brandName = config?.brandName || 'Nubank';
  const isFintech = isFintechOrBank(brandName);
  const isUrban = isPublicSectorOrUrban(brandName);
  const isPersonal = isPersonalProfile(brandName);

  const keywords = (Array.isArray(config?.primaryKeywords) && config!.primaryKeywords.length > 0)
    ? config!.primaryKeywords
    : [brandName, `#${brandName.replace(/\s+/g, '')}`, 'Suporte', 'Inovação'];

  const sensitive = (Array.isArray(config?.sensitiveCrisisTerms) && config!.sensitiveCrisisTerms.length > 0)
    ? config!.sensitiveCrisisTerms
    : ['Instabilidade', 'Reclamação', 'Golpe', 'Bloqueio', 'Cobrança indevida'];

  const activeChannels = (Array.isArray(config?.monitoredChannels) && config!.monitoredChannels.length > 0)
    ? config!.monitoredChannels
    : ['instagram', 'tiktok', 'twitter', 'youtube', 'news', 'reddit'];

  // 1. BRAND OVERVIEW METRICS
  const brand: BrandOverview = {
    brandName,
    reputationScore: isFintech ? 84 : (isUrban ? 78 : (isPersonal ? 94 : 88)),
    totalMentions: isFintech ? 28450 : (isUrban ? 16420 : (isPersonal ? 8940 : 14200)),
    growthRate24h: isFintech ? 24.6 : (isUrban ? 22.4 : (isPersonal ? 34.8 : 18.5)),
    sentimentSplit: isFintech
      ? { positive: 68, neutral: 21, negative: 8, critical: 3 }
      : (isUrban
          ? { positive: 62, neutral: 24, negative: 10, critical: 4 }
          : (isPersonal
              ? { positive: 85, neutral: 10, negative: 4, critical: 1 }
              : { positive: 70, neutral: 20, negative: 7, critical: 3 })),
    activeCrisisCount: isFintech ? 2 : (isUrban ? 2 : (isPersonal ? 0 : 1)),
    estimatedReach: isFintech ? 4800000 : (isUrban ? 3200000 : (isPersonal ? 1450000 : 2500000)),
  };

  // 2. CRISIS ALERTS
  let alerts: CrisisAlert[] = [];
  if (isFintech) {
    alerts = [
      {
        id: `alt-${Date.now()}-1`,
        title: `Pico de relatos no X / Twitter sobre ${sensitive[0] || 'Instabilidade'} no App da ${brandName}`,
        description: `Usuários reportam lentidão temporária ao tentar autenticar e realizar transferências PIX. Aceleração de +140% de menções negativas nos últimos 20 minutos.`,
        severity: 'high',
        channel: 'twitter',
        mentionCount: 840,
        negativeRatio: 68,
        triggeredAt: 'Há 14 minutos',
        status: 'active',
        recommendedAction: `Publicar posicionamento de transparência no X e orientar time de SAC com script padrão informando que o time de engenharia já está normalizando o acesso.`,
        affectedTopics: [sensitive[0] || 'Instabilidade', 'PIX', brandName, '#AppForaDoAr'],
      },
      {
        id: `alt-${Date.now()}-2`,
        title: `Alerta Preventivo de Golpe / Phishing usando a marca ${brandName} no Instagram`,
        description: `Perfil falso patrocinando anúncios fraudulentos prometendo limite imediato e pedindo dados bancários dos clientes.`,
        severity: 'critical',
        channel: 'instagram',
        mentionCount: 320,
        negativeRatio: 82,
        triggeredAt: 'Há 45 minutos',
        status: 'active',
        recommendedAction: `Solicitar takedown imediato à Meta através do canal prioritário de brand safety e emitir alerta de segurança nas redes oficiais.`,
        affectedTopics: ['Golpe', 'SegurançaDigital', 'Phishing', brandName],
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
  } else if (isPersonal) {
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
      }
    ];
  } else {
    alerts = [
      {
        id: `alt-${Date.now()}-1`,
        title: `Monitoramento Ativo: Crescimento de menções sobre suporte da marca ${brandName}`,
        description: `Algoritmo detectou aumento no volume de dúvidas de clientes sobre novidades e atualizações recentes.`,
        severity: 'medium',
        channel: 'twitter',
        mentionCount: 180,
        negativeRatio: 22,
        triggeredAt: 'Há 25 minutos',
        status: 'active',
        recommendedAction: `Reforçar atendimento no SAC e publicar FAQ explicativo.`,
        affectedTopics: [brandName, 'Suporte', 'Atualização'],
      }
    ];
  }

  // 3. DIVERSE & CONTEXT-RICH MENTIONS DATASET
  let mentions: Mention[] = [];

  if (isFintech) {
    mentions = [
      {
        id: `men-${Date.now()}-1`,
        channel: 'instagram',
        author: {
          name: 'Clarissa Finanças Pessoais',
          username: '@clarissa_financas',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 384000,
        },
        content: `Reel completo com meu comparativo das Caixinhas do ${brandName} com rendimento de 100% do CDI vs CDBs tradicionais. A liquidez diária e a facilidade de organizar metas continuam imbatíveis! 💜📈 Vocês usam? #FinançasPessoais #${brandName} #Investimentos`,
        mediaType: 'video',
        mediaUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
        transcription: `[Áudio do Reel Transcrito por IA]: "...olha só como funciona a regra de rendimento do ${brandName}. Se você deixar o dinheiro guardado por mais de 30 dias, o IOF é zerado e o rendimento sobe..."`,
        timestamp: 'Há 8 min',
        likes: 4210,
        comments: 312,
        shares: 640,
        sentiment: 'positive',
        sentimentScore: 0.96,
        riskLevel: 'low',
        topics: [brandName, '#Investimentos', '#Caixinhas', 'Finanças'],
        reachEstimate: 450000,
        aiAnalysis: {
          summary: `Reel viral de influenciadora financeira com alta autoridade gerando forte validação de produto para ${brandName}.`,
          emotion: 'Aprovação',
          crisisIndicator: false,
          suggestedAction: `Comentar no post reforçando as novidades das Caixinhas e fixar como case de prova social.`,
        }
      },
      {
        id: `men-${Date.now()}-2`,
        channel: 'twitter',
        author: {
          name: 'Rodrigo Medeiros',
          username: '@rodrigomedeiros_dev',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 3400,
        },
        content: `Mais alguém com instabilidade ao tentar transferir via PIX no app do ${brandName} agora? Fica carregando em loop infinito e da erro de conexão. Alô @${brandName.toLowerCase()} ajuda aí! ⚠️📱`,
        timestamp: 'Há 12 min',
        likes: 85,
        comments: 34,
        shares: 18,
        sentiment: 'negative',
        sentimentScore: 0.88,
        riskLevel: 'high',
        topics: [brandName, 'PIX', 'Instabilidade', 'App'],
        reachEstimate: 24000,
        aiAnalysis: {
          summary: `Relato com alto engajamento no X apontando falha na rota de pagamento PIX do ${brandName}.`,
          emotion: 'Frustração',
          crisisIndicator: true,
          suggestedAction: `Acionar equipe de suporte técnico imediatamente e responder com protocolo no X.`,
        }
      },
      {
        id: `men-${Date.now()}-3`,
        channel: 'tiktok',
        author: {
          name: 'Gabi & Viagens',
          username: '@gabiviagens',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 820000,
        },
        content: `Dica de viagem internacional: usei a Conta Global da ${brandName} na Europa e economizei muito no IOF e na cotação comercial! Zero dor de cabeça pra passar o cartão por aproximação no metrô de Londres. ✈️💳✨ #Viagem #DicasDeViagem #${brandName}`,
        mediaType: 'video',
        mediaUrl: 'https://images.unsplash.com/photo-1512353087810-25dfcd100962?w=600&auto=format&fit=crop&q=80',
        transcription: `[Áudio do TikTok]: "...gente, sério, a cotação da moeda estrangeira no ${brandName} saiu muito mais barata que na casa de câmbio física..."`,
        timestamp: 'Há 25 min',
        likes: 12400,
        comments: 480,
        shares: 1890,
        sentiment: 'positive',
        sentimentScore: 0.98,
        riskLevel: 'low',
        topics: [brandName, '#ContaGlobal', 'Viagem', 'Cartão'],
        reachEstimate: 980000,
        aiAnalysis: {
          summary: `Vídeo com engajamento expressivo promovendo a funcionalidade de conta internacional de forma orgânica.`,
          emotion: 'Entusiasmo',
          crisisIndicator: false,
          suggestedAction: `Interagir no TikTok e avaliar parceria de co-branding para campanhas de férias.`,
        }
      },
      {
        id: `men-${Date.now()}-4`,
        channel: 'news',
        author: {
          name: 'G1 Economia & Negócios',
          username: '@g1_economia',
          avatar: 'https://images.unsplash.com/photo-1586339949916-3e945abeb6e0?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 2400000,
        },
        content: `Mercado Financeiro: "${brandName} atinge marca histórica de clientes ativos e registra salto no lucro operacional impulsionado por crédito inteligente e expansão internacional no México e Colômbia."`,
        timestamp: 'Há 45 min',
        likes: 3100,
        comments: 190,
        shares: 820,
        sentiment: 'positive',
        sentimentScore: 0.95,
        riskLevel: 'low',
        topics: [brandName, 'Economia', 'Resultados', 'Expansão'],
        reachEstimate: 3100000,
        aiAnalysis: {
          summary: `Matéria de imprensa de primeira linha reforçando solidez corporativa e atratividade para investidores.`,
          emotion: 'Confiança',
          crisisIndicator: false,
          suggestedAction: `Distribuir clipping no boletim executivo de relações com investidores.`,
        }
      },
      {
        id: `men-${Date.now()}-5`,
        channel: 'youtube',
        author: {
          name: 'Canal Tech & Investimentos',
          username: '@tech_invest_br',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 520000,
        },
        content: `Review e Teste Prático: "Novas Ferramentas de Inteligência Artificial no App da ${brandName} - Vale a pena ativar o assistente financeiro automático?"`,
        mediaType: 'video',
        mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
        transcription: `[Áudio do Vídeo]: "...o recurso de IA do ${brandName} agora categoriza seus gastos automaticamente e dá alertas preditivos de fatura..."`,
        timestamp: 'Há 1 hora',
        likes: 5600,
        comments: 340,
        shares: 410,
        sentiment: 'positive',
        sentimentScore: 0.92,
        riskLevel: 'low',
        topics: [brandName, 'IA', 'Tecnologia', 'Review'],
        reachEstimate: 620000,
        aiAnalysis: {
          summary: `Análise técnica de produto destacando o diferencial inovador de recursos de IA para retenção de clientes.`,
          emotion: 'Curiosidade',
          crisisIndicator: false,
          suggestedAction: `Comentar pelo canal oficial tirando dúvidas técnicas dos usuários.`,
        }
      },
      {
        id: `men-${Date.now()}-6`,
        channel: 'reddit',
        author: {
          name: 'Comunidade r/investimentos',
          username: 'u/faria_lima_trader',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 4800,
        },
        content: `Discussão sobre taxas de juros no rotativo e programa de cashback do cartão ultravioleta da ${brandName}. Alguém aqui conseguiu isenção mantendo os investimentos na plataforma?`,
        timestamp: 'Há 2 horas',
        likes: 194,
        comments: 88,
        shares: 12,
        sentiment: 'neutral',
        sentimentScore: 0.72,
        riskLevel: 'low',
        topics: [brandName, 'Cartão', 'Cashback', 'Investimentos'],
        reachEstimate: 45000,
        aiAnalysis: {
          summary: `Debate técnico e aprofundado em fórum qualificado de investidores sobre regras de isenção e benefícios premium.`,
          emotion: 'Interesse',
          crisisIndicator: false,
          suggestedAction: `Monitorar dúvidas frequentes para alimentar FAQs de suporte no site.`,
        }
      }
    ];
  } else if (isUrban) {
    mentions = [
      {
        id: `men-${Date.now()}-1`,
        channel: 'twitter',
        author: {
          name: 'Carlos Eduardo Trânsito',
          username: '@carlosedu_transito',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 6400,
        },
        content: `Alerta motoristas: semáforo apagado no cruzamento da Av. Djalma Batista com Rua Pará. Agentes do ${brandName} já foram acionados para ordenar o fluxo! Redobrem a atenção! 🚦⚠️ #${brandName}`,
        timestamp: 'Há 6 min',
        likes: 140,
        comments: 28,
        shares: 45,
        sentiment: 'neutral',
        sentimentScore: 0.65,
        riskLevel: 'medium',
        topics: ['Trânsito', 'Semáforo', brandName],
        reachEstimate: 18000,
        aiAnalysis: {
          summary: `Aviso comunitário sobre retenção de tráfego com direcionamento direto para a central operacional do ${brandName}.`,
          emotion: 'Alerta',
          crisisIndicator: false,
          suggestedAction: `Enviar equipe de agentes imediatamente ao local e confirmar intervenção nos canais oficiais.`,
        }
      },
      {
        id: `men-${Date.now()}-2`,
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
        timestamp: 'Há 22 min',
        likes: 890,
        comments: 45,
        shares: 28,
        sentiment: 'positive',
        sentimentScore: 0.96,
        riskLevel: 'low',
        topics: ['#AtendimentoAgil', brandName, 'DefesaCivil'],
        reachEstimate: 38000,
        aiAnalysis: {
          summary: `Elogio espontâneo de cidadã ao tempo de resposta do chamado urbano.`,
          emotion: 'Gratidão',
          crisisIndicator: false,
          suggestedAction: `Curtir e repostar nos stories institucionais como prova social de eficiência.`,
        }
      }
    ];
  } else {
    mentions = [
      {
        id: `men-${Date.now()}-1`,
        channel: 'instagram',
        author: {
          name: 'Juliana Vasconcelos',
          username: '@ju_vasconcelos_tech',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 92000,
        },
        content: `Testei a nova plataforma da ${brandName} hoje e fiquei muito impressionada com a velocidade de resposta e a intuitividade do painel. Recomendo muito pra quem busca inovação de verdade! 🚀👏 #${brandName.replace(/\s+/g, '')}`,
        mediaType: 'video',
        mediaUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80',
        transcription: `[Áudio do Reel]: "...a integração dos recursos da ${brandName} funcionou perfeitamente e reduziu o tempo de análise..."`,
        timestamp: 'Há 10 min',
        likes: 1420,
        comments: 98,
        shares: 115,
        sentiment: 'positive',
        sentimentScore: 0.94,
        riskLevel: 'low',
        topics: [brandName, 'Inovação', 'Tecnologia'],
        reachEstimate: 140000,
        aiAnalysis: {
          summary: `Reel de criadora de conteúdo elogiando performance e usabilidade da ${brandName}.`,
          emotion: 'Entusiasmo',
          crisisIndicator: false,
          suggestedAction: `Curtir e repostar nas mídias oficiais.`,
        }
      },
      {
        id: `men-${Date.now()}-2`,
        channel: 'twitter',
        author: {
          name: 'Marcos Vinicius',
          username: '@marcos_vini_opiniao',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 4200,
        },
        content: `Atendimento da ${brandName} resolveu meu problema de suporte em menos de 5 minutos pelo chat. Equipe nota 10 no suporte ao cliente! 💬⚡`,
        timestamp: 'Há 18 min',
        likes: 74,
        comments: 12,
        shares: 9,
        sentiment: 'positive',
        sentimentScore: 0.96,
        riskLevel: 'low',
        topics: [brandName, 'Suporte', 'Atendimento'],
        reachEstimate: 15000,
        aiAnalysis: {
          summary: `Feedback direto positivo sobre rapidez de atendimento no suporte.`,
          emotion: 'Agradecimento',
          crisisIndicator: false,
          suggestedAction: `Agradecer pelo feedback público.`,
        }
      }
    ];
  }

  // 4. DYNAMIC TOPIC CLOUD
  const topics: TopicItem[] = isFintech
    ? [
        { name: brandName, count: 9840, sentiment: 'positive', growth: '+32%' },
        { name: '#Investimentos', count: 4210, sentiment: 'positive', growth: '+45%' },
        { name: '#CaixinhasNu', count: 3450, sentiment: 'positive', growth: '+58%' },
        { name: 'PIX & Pagamentos', count: 2890, sentiment: 'neutral', growth: '+18%' },
        { name: sensitive[0] || 'Instabilidade', count: 1840, sentiment: 'critical', growth: '+120%' },
        { name: 'Conta Global', count: 1620, sentiment: 'positive', growth: '+64%' },
        { name: 'Cartão de Crédito', count: 1450, sentiment: 'positive', growth: '+12%' },
        { name: 'Golpe & Segurança', count: 890, sentiment: 'critical', growth: '+40%' }
      ]
    : (isUrban
        ? [
            { name: brandName, count: 6240, sentiment: 'positive', growth: '+28%' },
            { name: sensitive[0] || 'Alagamento', count: 2310, sentiment: 'critical', growth: '+125%' },
            { name: '#TrânsitoSeguro', count: 1980, sentiment: 'positive', growth: '+42%' },
            { name: 'Semáforos', count: 1420, sentiment: 'negative', growth: '+15%' },
            { name: 'Defesa Civil', count: 1350, sentiment: 'positive', growth: '+35%' }
          ]
        : [
            { name: brandName, count: 4850, sentiment: 'positive', growth: '+25%' },
            { name: '#Inovação', count: 2190, sentiment: 'positive', growth: '+38%' },
            { name: 'Suporte ao Cliente', count: 1850, sentiment: 'positive', growth: '+15%' },
            { name: sensitive[0] || 'Reclamação', count: 780, sentiment: 'negative', growth: '+10%' }
          ]);

  // 5. MULTICHANNEL DISTRIBUTION
  const channelList: ChannelStat[] = [
    { id: 'instagram', name: 'Instagram', count: isFintech ? 9400 : 4820, percent: 34, color: 'text-pink-400', barBg: 'bg-pink-500' },
    { id: 'tiktok', name: 'TikTok', count: isFintech ? 6800 : 3560, percent: 24, color: 'text-cyan-400', barBg: 'bg-cyan-500' },
    { id: 'twitter', name: 'X / Twitter', count: isFintech ? 6200 : 2840, percent: 22, color: 'text-sky-400', barBg: 'bg-sky-500' },
    { id: 'youtube', name: 'YouTube', count: isFintech ? 3400 : 1710, percent: 12, color: 'text-red-400', barBg: 'bg-red-500' },
    { id: 'news', name: 'Portais & Notícias', count: isFintech ? 1800 : 850, percent: 6, color: 'text-emerald-400', barBg: 'bg-emerald-500' },
    { id: 'reddit', name: 'Reddit & Fóruns', count: isFintech ? 850 : 500, percent: 2, color: 'text-orange-400', barBg: 'bg-orange-500' },
  ];

  const filteredChannels = channelList.filter(ch => activeChannels.includes(ch.id));
  const totalPostCount = filteredChannels.reduce((acc, c) => acc + c.count, 0);
  const channels = filteredChannels.map(c => ({
    ...c,
    percent: totalPostCount > 0 ? Math.round((c.count / totalPostCount) * 100) : c.percent
  }));

  // 6. VOLUME TIMELINE
  const timeline: VolumePoint[] = [
    { time: '00:00', volume: 220, positive: 180, negative: 35, critical: 5 },
    { time: '03:00', volume: 110, positive: 90, negative: 18, critical: 2 },
    { time: '06:00', volume: 480, positive: 390, negative: 80, critical: 10 },
    { time: '09:00', volume: 1650, positive: 1320, negative: 280, critical: 50 },
    { time: '12:00', volume: 2840, positive: 2280, negative: 480, critical: 80 },
    { time: '14:00', volume: 3950, positive: 3100, negative: 680, critical: 170 },
    { time: '16:00', volume: 3200, positive: 2600, negative: 510, critical: 90 },
    { time: '18:00', volume: 2450, positive: 2050, negative: 340, critical: 60 },
    { time: '21:00', volume: 1850, positive: 1540, negative: 260, critical: 50 }
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

export function generateLiveScanMention(config?: Partial<BrandMonitorConfig> | null): Mention {
  const brandName = config?.brandName || 'Nubank';
  const isFintech = isFintechOrBank(brandName);

  if (isFintech) {
    const liveSamples: Mention[] = [
      {
        id: `men-live-${Date.now()}-1`,
        channel: 'instagram',
        author: {
          name: 'Felipe Bastos Finanças',
          username: '@felipebastos_fin',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          verified: true,
          followersCount: 215000,
        },
        content: `Acabei de publicar nos stories: como usar a reserva de emergência da ${brandName} com rendimento diário e resgate 24h sem risco. Vale a pena conferir! 💰🚀 #${brandName}`,
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
        timestamp: 'Agora mesmo',
        likes: 184,
        comments: 29,
        shares: 42,
        sentiment: 'positive',
        sentimentScore: 0.98,
        riskLevel: 'low',
        topics: [brandName, '#Investimentos', '#ReservaDeEmergencia'],
        reachEstimate: 42000,
        aiAnalysis: {
          summary: `Publicação em tempo real no Instagram com recomendação técnica de produto.`,
          emotion: 'Entusiasmo',
          crisisIndicator: false,
          suggestedAction: `Interagir no comentário e republicar nos stories oficiais.`,
        }
      },
      {
        id: `men-live-${Date.now()}-2`,
        channel: 'twitter',
        author: {
          name: 'Beatriz Almeida',
          username: '@bia_almeida_sp',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          verified: false,
          followersCount: 5200,
        },
        content: `O atendimento no chat do ${brandName} me atendeu em menos de 1 minuto e estornou uma cobrança duplicada da maquininha. É por isso que não largo esse roxinho! 💜👏`,
        timestamp: 'Agora mesmo',
        likes: 92,
        comments: 11,
        shares: 15,
        sentiment: 'positive',
        sentimentScore: 0.99,
        riskLevel: 'low',
        topics: [brandName, '#AtendimentoNota10', 'Suporte'],
        reachEstimate: 19000,
        aiAnalysis: {
          summary: `Elogio em tempo real à eficiência do time de suporte ao cliente.`,
          emotion: 'Gratidão',
          crisisIndicator: false,
          suggestedAction: `Curtir e responder com emoji de carinho.`,
        }
      }
    ];
    return liveSamples[Math.floor(Math.random() * liveSamples.length)];
  }

  return {
    id: `men-live-${Date.now()}`,
    channel: 'instagram',
    author: {
      name: 'Carla Silveira',
      username: '@carla_silveira_tech',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      verified: true,
      followersCount: 84000,
    },
    content: `Muito impressionada com a velocidade de inovação da ${brandName}! Experiência de uso super fluida e transparente. 🚀✨ #${brandName.replace(/\s+/g, '')}`,
    timestamp: 'Agora mesmo',
    likes: 340,
    comments: 28,
    shares: 45,
    sentiment: 'positive',
    sentimentScore: 0.96,
    riskLevel: 'low',
    topics: [brandName, 'Inovação', 'Qualidade'],
    reachEstimate: 65000,
    aiAnalysis: {
      summary: `Menção em tempo real de criadora de conteúdo validando a marca ${brandName}.`,
      emotion: 'Aprovação',
      crisisIndicator: false,
      suggestedAction: `Agradecer nos comentários.`,
    }
  };
}

export const INITIAL_DATASET = generateBrandDataset(DEFAULT_MONITOR_CONFIG);
export const INITIAL_BRAND = INITIAL_DATASET.brand;
export const INITIAL_ALERTS = INITIAL_DATASET.alerts;
export const INITIAL_MENTIONS = INITIAL_DATASET.mentions;
export const TOPICS_DATA = INITIAL_DATASET.topics;
export const VOLUME_TIMELINE_DATA = INITIAL_DATASET.timeline;
