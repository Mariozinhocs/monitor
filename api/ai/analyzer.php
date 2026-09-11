<?php
// Motor de Análise Semântica, Sentimento & IA - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// "si vis pacem para bellum"

class SentinelaAIAnalyzer {

    private static $criticalKeywords = [
        'alagamento', 'alagada', 'semáforo quebrado', 'semaforo quebrado', 
        'acidente grave', 'deslizamento', 'falta de luz', 'interdição', 
        'interdicao', 'crise', 'procon', 'vazamento', 'processo', 'fraude', 
        'reclameaqui', 'caos', 'urgente', 'denúncia', 'denuncia', 'vergonha',
        'abandono', 'perigo', 'risco', 'socorro', 'descaso', 'incompetência'
    ];

    private static $negativeKeywords = [
        'demora', 'ruim', 'péssimo', 'pessimo', 'lentidão', 'lentidao',
        'trânsito parado', 'transito travado', 'congestionamento', 'buraco',
        'estragado', 'defeito', 'reclamação', 'reclamacao', 'falha', 'atraso',
        'espera', 'fila', 'dificuldade', 'problema', 'bug', 'travando'
    ];

    private static $positiveKeywords = [
        'parabéns', 'parabens', 'excelente', 'rápido', 'rapido', 'agilidade',
        'ótimo', 'otimo', 'top', 'eficiente', 'eficiência', 'resolvido',
        'suporte nota 10', 'agradeço', 'agradeco', 'obrigado', 'inovação',
        'inovacao', 'segurança', 'seguranca', 'fluindo', 'limpo', 'organizado',
        'parceria', 'tecnologia', 'sucesso', 'maravilha', 'show'
    ];

    /**
     * Analisa um texto e retorna o diagnóstico completo de inteligência
     */
    public static function analyze(string $text, array $sensitiveTerms = []): array {
        $textLower = mb_strtolower($text, 'UTF-8');
        
        $criticalWords = array_merge(self::$criticalKeywords, array_map('mb_strtolower', $sensitiveTerms));
        
        $criticalMatches = [];
        foreach ($criticalWords as $word) {
            if (!empty($word) && mb_strpos($textLower, $word) !== false) {
                $criticalMatches[] = $word;
            }
        }

        $negativeMatches = [];
        foreach (self::$negativeKeywords as $word) {
            if (mb_strpos($textLower, $word) !== false) {
                $negativeMatches[] = $word;
            }
        }

        $positiveMatches = [];
        foreach (self::$positiveKeywords as $word) {
            if (mb_strpos($textLower, $word) !== false) {
                $positiveMatches[] = $word;
            }
        }

        // Determinação de Sentimento e Risco
        $sentiment = 'neutral';
        $sentimentScore = 0.50;
        $riskLevel = 'low';
        $emotion = 'Neutro / Informativo';
        $suggestedAction = 'Manter em monitoramento passivo.';
        $isCrisis = false;

        if (count($criticalMatches) > 0) {
            $sentiment = 'critical';
            $sentimentScore = max(0.85, min(0.98, 0.80 + (count($criticalMatches) * 0.05)));
            $riskLevel = count($criticalMatches) > 1 ? 'critical' : 'high';
            $emotion = 'Indignação / Alerta Máximo';
            $isCrisis = true;
            $suggestedAction = 'PRIORIDADE MÁXIMA: Acionar comitê operacional e despachar equipe de resposta imediata ao local.';
        } elseif (count($negativeMatches) > count($positiveMatches)) {
            $sentiment = 'negative';
            $sentimentScore = 0.70;
            $riskLevel = 'medium';
            $emotion = 'Insatisfação / Frustração';
            $suggestedAction = 'Interagir com o cidadão/usuário informando protocolo de verificação da ocorrência.';
        } elseif (count($positiveMatches) > count($negativeMatches)) {
            $sentiment = 'positive';
            $sentimentScore = max(0.80, min(0.98, 0.80 + (count($positiveMatches) * 0.04)));
            $riskLevel = 'low';
            $emotion = 'Reconhecimento / Agradecimento';
            $suggestedAction = 'Interagir agradecendo o feedback positivo e registrar no clipping institucional.';
        }

        // Resumo executivo da IA
        $summary = self::generateSummary($text, $sentiment, $criticalMatches, $emotion);

        return [
            'sentiment' => $sentiment,
            'sentiment_score' => round($sentimentScore, 2),
            'risk_level' => $riskLevel,
            'emotion' => $emotion,
            'is_crisis' => $isCrisis,
            'critical_matches' => $criticalMatches,
            'summary' => $summary,
            'suggested_action' => $suggestedAction
        ];
    }

    private static function generateSummary(string $text, string $sentiment, array $criticalMatches, string $emotion): string {
        $cleanText = preg_replace('/\s+/', ' ', trim($text));
        $excerpt = mb_substr($cleanText, 0, 140);
        if (mb_strlen($cleanText) > 140) $excerpt .= '...';

        if ($sentiment === 'critical') {
            $terms = implode(', ', array_slice($criticalMatches, 0, 3));
            return "Publicação com alto risco de repercussão identificando termos sensíveis ({$terms}). Emoção detectada: {$emotion}.";
        } elseif ($sentiment === 'positive') {
            return "Feedback espontâneo favorável destacando eficiência e prontidão operacional.";
        } elseif ($sentiment === 'negative') {
            return "Reclamação pontual de munícipe/usuário com demanda por atendimento ou resolução.";
        }

        return "Menção informativa citando termos monitorados sem indicativo de crise.";
    }
}
