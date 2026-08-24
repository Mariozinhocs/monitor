import { AIExecutiveReport, BrandOverview, Mention, CrisisAlert } from '../types/monitor';

export function generateExecutiveReport(
  brand: BrandOverview,
  mentions: Mention[],
  alerts: CrisisAlert[]
): AIExecutiveReport {
  const activeCrises = alerts.filter(a => a.status === 'active');
  const criticalCount = mentions.filter(m => m.sentiment === 'critical' || m.riskLevel === 'critical').length;

  return {
    generatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    period: 'Últimas 24 Horas',
    overallSentiment: brand.sentimentSplit.positive >= 60 ? 'Predominantemente Favorável (62% Positivo)' : 'Em Alerta Moderado',
    executiveSummary: `A marca ${brand.brandName} registrou um volume total de ${brand.totalMentions.toLocaleString()} menções nas últimas 24h (+${brand.growthRate24h}% de aceleração). A recepção ao novo motor de IA foi amplamente elogiada pela imprensa e influenciadores de tecnologia. No entanto, um incidente de instabilidade no checkout no TikTok (#BugApp) gerou um pico localizado de insatisfação que exige contenção imediata para evitar propagação para o Reclame Aqui e Procon.`,
    topDriversPositive: [
      'Lançamento da suíte preditiva com IA gerou cobertura positiva em portais de tecnologia.',
      'Elogios espontâneos à velocidade de geração de relatórios e interface moderna.',
      'Repercussão favorável em canal especializado no YouTube com alta retenção.'
    ],
    topDriversNegative: [
      'Gargalo temporário no fluxo de checkout durante promoção relâmpago (TikTok).',
      'Tempo de espera no atendimento via chatbot (menções citando Procon no X).',
      'Dúvidas pontuais sobre migração e suporte da versão anterior.'
    ],
    crisisRiskEvaluation: activeCrises.length > 0 
      ? `NÍVEL DE ATENÇÃO ELEVADO (${activeCrises.length} crise(s) ativa(s)): Risco de propagação do vídeo viral do TikTok estimado em 42% nas próximas 2 horas se não houver posicionamento oficial.`
      : 'NÍVEL DE RISCO CONTROLADO: Nenhuma crise ativa com potencial de escalada nas próximas 12 horas.',
    strategicRecommendations: [
      'Disparar comunicado oficial no TikTok com transparência técnica sobre a correção da instabilidade.',
      'Habilitar fila prioritária no SAC para usuários que mencionaram a marca com sentimento crítico.',
      'Aproveitar o momento positivo na imprensa para impulsionar a campanha institucional no LinkedIn.'
    ]
  };
}
