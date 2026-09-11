import { AIExecutiveReport, BrandOverview, Mention, CrisisAlert } from '../types/monitor';
import { isPublicSectorOrUrban } from './mockDataService';

export function generateExecutiveReport(
  brand: BrandOverview,
  mentions: Mention[],
  alerts: CrisisAlert[]
): AIExecutiveReport {
  const activeCrises = alerts.filter(a => a.status === 'active');
  const isUrban = isPublicSectorOrUrban(brand.brandName);
  const positiveRatio = brand.sentimentSplit.positive;

  let overallSentimentText = 'Predominantemente Favorável';
  if (positiveRatio >= 70) {
    overallSentimentText = `Altamente Positivo (${positiveRatio}% Favorável)`;
  } else if (positiveRatio >= 55) {
    overallSentimentText = `Predominantemente Favorável (${positiveRatio}% Positivo)`;
  } else {
    overallSentimentText = `Em Alerta Moderado (${brand.sentimentSplit.negative + brand.sentimentSplit.critical}% Rejeição)`;
  }

  let executiveSummary = '';
  let topDriversPositive: string[] = [];
  let topDriversNegative: string[] = [];
  let crisisRiskEvaluation = '';
  let strategicRecommendations: string[] = [];

  if (isUrban) {
    executiveSummary = `O ${brand.brandName} registrou um volume expressivo de ${brand.totalMentions.toLocaleString()} menções nas últimas 24h (+${brand.growthRate24h}% de aceleração). A atuação preventiva das equipes em campo e o monitoramento inteligente de vias foram amplamente destacados pela imprensa regional e redes sociais. Identificamos pontos de atenção ligados a retenção de tráfego e semáforos em cruzamentos críticos, onde a resposta rápida da central evitou a escalada de reclamações populares.`;
    
    topDriversPositive = [
      `Cobertura positiva de portais de notícias destacando prontidão e tecnologia do ${brand.brandName}.`,
      'Elogios de cidadãos ao tempo de resposta de chamados de desobstrução de vias e apoio da Defesa Civil.',
      'Repercussão favorável de matérias em vídeo sobre monitoramento integrado e segurança preventiva.'
    ];

    topDriversNegative = [
      'Reclamações pontuais de motoristas sobre semáforos com lentidão ou intermitência em vias arteriais.',
      'Relatos de pontos de retenção de tráfego em horários de pico sob condições climáticas adversas.',
      'Dúvidas da população sobre canais de atendimento direto e status de chamados abertos.'
    ];

    crisisRiskEvaluation = activeCrises.length > 0
      ? `NÍVEL DE ATENÇÃO OPERACIONAL (${activeCrises.length} incidente(s) ativo(s)): Monitoramento focado na mobilidade urbana e pontos de retenção. Risco de repercussão comunitária estimado em 28% se houver demora na normalização do tráfego.`
      : 'NÍVEL DE RISCO CONTROLADO: Vias monitoradas com fluxo estável e sem incidentes críticos em andamento.';

    strategicRecommendations = [
      `Manter boletins de trânsito em tempo real atualizados nos perfis oficiais do ${brand.brandName}.`,
      'Reforçar o despacho de agentes e viaturas para os cruzamentos identificados com maior volume de relatos no TikTok e X.',
      'Divulgar os indicadores de resolutividade nas redes para reforçar a percepção de eficiência pública.'
    ];
  } else {
    executiveSummary = `A marca ${brand.brandName} registrou um volume total de ${brand.totalMentions.toLocaleString()} menções nas últimas 24h (+${brand.growthRate24h}% de aceleração). A satisfação geral dos usuários permanece sólida, impulsionada por feedbacks positivos de suporte e usabilidade. Eventos pontuais de suporte nas redes sociais estão sob acompanhamento para garantir contenção antes de impactar os canais de ouvidoria.`;

    topDriversPositive = [
      `Elogios à qualidade do produto e agilidade no atendimento ao cliente da ${brand.brandName}.`,
      'Repercussão espontânea positiva em canais de mídia e formadores de opinião.',
      'Satisfação com atualizações recentes e estabilidade dos serviços.'
    ];

    topDriversNegative = [
      'Dúvidas de novos usuários durante processos de onboarding ou integração.',
      'Menções pontuais solicitando mais opções de personalização e suporte estendido.',
      'Pequenas oscilações de atendimento relatadas em fóruns técnicos.'
    ];

    crisisRiskEvaluation = activeCrises.length > 0
      ? `NÍVEL DE ATENÇÃO MODERADO (${activeCrises.length} alerta(s) ativo(s)): Acompanhamento de menções sensíveis recomendado nas próximas 4 horas.`
      : 'NÍVEL DE RISCO CONTROLADO: Nenhuma crise ativa com potencial de escalada nas próximas 12 horas.';

    strategicRecommendations = [
      `Interagir diretamente com usuários que postaram feedbacks sobre ${brand.brandName} nas redes.`,
      'Alinhar o time de PR e SAC para manter o tempo médio de resposta abaixo de 10 minutos.',
      'Aproveitar menções de influenciadores para fortalecer campanhas de prova social.'
    ];
  }

  return {
    generatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    period: 'Últimas 24 Horas',
    overallSentiment: overallSentimentText,
    executiveSummary,
    topDriversPositive,
    topDriversNegative,
    crisisRiskEvaluation,
    strategicRecommendations
  };
}
