<?php
// Orquestrador de Varredura e Coleta - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// "si vis pacem para bellum"

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/instagram.php';

$rawInput = file_get_contents('php://input');
$rawInput = trim($rawInput, "\xEF\xBB\xBF \t\n\r\0\x0B");
$input = json_decode($rawInput, true) ?? $_POST;

$term = trim($input['term'] ?? 'Centro de Cooperação da Cidade');
$sensitiveTerms = is_array($input['sensitive_terms'] ?? null) ? $input['sensitive_terms'] : ['Alagamento', 'Semáforo Quebrado', 'Acidente Grave'];
$channels = is_array($input['channels'] ?? null) ? $input['channels'] : ['instagram'];

$jobId = 'job-' . uniqid();
$allNewMentions = [];

try {
    $pdo = getDbConnection();

    // 1. Executa coleta no Instagram se selecionado
    if (in_array('instagram', $channels) || empty($channels)) {
        $igMentions = InstagramOpenCollector::search($term, $sensitiveTerms);
        $allNewMentions = array_merge($allNewMentions, $igMentions);
    }

    // 2. Persiste as menções capturadas no MySQL
    if ($pdo && count($allNewMentions) > 0) {
        $insertStmt = $pdo->prepare("
            INSERT INTO `mencoes` (
                id, canal, autor_nome, autor_username, autor_avatar, 
                autor_verificado, autor_seguidores, conteudo, media_url, 
                media_tipo, transcricao_ia, curtidas, comentarios, 
                compartilhamentos, sentimento, sentimento_score, 
                nivel_risco, topicos_json, ai_resumo, ai_emocao, 
                ai_acao_sugerida
            ) VALUES (
                :id, :canal, :autor_nome, :autor_username, :autor_avatar,
                :autor_verificado, :autor_seguidores, :conteudo, :media_url,
                :media_tipo, :transcricao_ia, :curtidas, :comentarios,
                :compartilhamentos, :sentimento, :sentimento_score,
                :nivel_risco, :topicos_json, :ai_resumo, :ai_emocao,
                :ai_acao_sugerida
            )
            ON DUPLICATE KEY UPDATE curtidas = VALUES(curtidas), comentarios = VALUES(comentarios)
        ");

        foreach ($allNewMentions as $m) {
            try {
                $insertStmt->execute([
                    ':id' => $m['id'],
                    ':canal' => $m['channel'],
                    ':autor_nome' => $m['author']['name'],
                    ':autor_username' => $m['author']['username'],
                    ':autor_avatar' => $m['author']['avatar'],
                    ':autor_verificado' => $m['author']['verified'] ? 1 : 0,
                    ':autor_seguidores' => $m['author']['followersCount'],
                    ':conteudo' => $m['content'],
                    ':media_url' => $m['mediaUrl'] ?? null,
                    ':media_tipo' => $m['mediaType'] ?? 'none',
                    ':transcricao_ia' => $m['transcription'] ?? null,
                    ':curtidas' => $m['likes'],
                    ':comentarios' => $m['comments'],
                    ':compartilhamentos' => $m['shares'],
                    ':sentimento' => $m['sentiment'],
                    ':sentimento_score' => $m['sentimentScore'],
                    ':nivel_risco' => $m['riskLevel'],
                    ':topicos_json' => json_encode($m['topics'], JSON_UNESCAPED_UNICODE),
                    ':ai_resumo' => $m['aiAnalysis']['summary'],
                    ':ai_emocao' => $m['aiAnalysis']['emotion'],
                    ':ai_acao_sugerida' => $m['aiAnalysis']['suggestedAction']
                ]);
            } catch (Exception $e) {
                // Continua inserção dos demais
            }
        }

        // 3. Registra Job de Coleta
        try {
            $jobStmt = $pdo->prepare("
                INSERT INTO `coleta_jobs` (id, canal, termo_busca, status, posts_encontrados, finalizado_em)
                VALUES (:id, :canal, :termo, 'completed', :posts, NOW())
            ");
            $jobStmt->execute([
                ':id' => $jobId,
                ':canal' => implode(',', $channels),
                ':termo' => $term,
                ':posts' => count($allNewMentions)
            ]);
        } catch (Exception $e) {
            // Ignora erro não crítico de log de job
        }
    }

    echo json_encode([
        'status' => 'success',
        'job_id' => $jobId,
        'term' => $term,
        'channel' => 'instagram',
        'captured_count' => count($allNewMentions),
        'mentions' => $allNewMentions,
        'timestamp' => date('c')
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro ao processar varredura do Instagram.',
        'details' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
