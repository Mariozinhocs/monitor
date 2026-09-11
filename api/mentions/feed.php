<?php
// API Endpoint de Feed de Menções - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// "si vis pacem para bellum"

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/database.php';

try {
    $pdo = getDbConnection();

    $channel = trim($_GET['channel'] ?? '');
    $sentiment = trim($_GET['sentiment'] ?? '');
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 20)));

    $sql = "SELECT * FROM `mencoes` WHERE 1=1";
    $params = [];

    if (!empty($channel) && $channel !== 'all') {
        $sql .= " AND canal = :canal";
        $params[':canal'] = $channel;
    }

    if (!empty($sentiment) && $sentiment !== 'all') {
        $sql .= " AND sentimento = :sentimento";
        $params[':sentimento'] = $sentiment;
    }

    $sql .= " ORDER BY criado_em DESC LIMIT :lim";

    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $val) {
        $stmt->bindValue($key, $val);
    }
    $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
    $stmt->execute();

    $rows = $stmt->fetchAll();

    $mentions = [];
    foreach ($rows as $row) {
        $topics = [];
        if (!empty($row['topicos_json'])) {
            $topics = json_decode($row['topicos_json'], true) ?: [];
        }

        $mentions[] = [
            'id' => $row['id'],
            'channel' => $row['canal'],
            'author' => [
                'name' => $row['autor_nome'],
                'username' => $row['autor_username'],
                'avatar' => $row['autor_avatar'] ?: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                'verified' => (bool)$row['autor_verificado'],
                'followersCount' => (int)$row['autor_seguidores']
            ],
            'content' => $row['conteudo'],
            'mediaUrl' => $row['media_url'],
            'mediaType' => $row['media_tipo'],
            'transcription' => $row['transcricao_ia'],
            'timestamp' => date('H:i, d/m', strtotime($row['criado_em'])),
            'likes' => (int)$row['curtidas'],
            'comments' => (int)$row['comentarios'],
            'shares' => (int)$row['compartilhamentos'],
            'sentiment' => $row['sentimento'],
            'sentimentScore' => (float)$row['sentimento_score'],
            'riskLevel' => $row['nivel_risco'],
            'topics' => $topics,
            'reachEstimate' => (int)$row['autor_seguidores'] * 3,
            'aiAnalysis' => [
                'summary' => $row['ai_resumo'] ?: 'Menção indexada pelo Sentinela.',
                'emotion' => $row['ai_emocao'] ?: 'Neutro',
                'crisisIndicator' => ($row['nivel_risco'] === 'critical' || $row['sentimento'] === 'critical'),
                'suggestedAction' => $row['ai_acao_sugerida'] ?: 'Acompanhar desdobramento.'
            ]
        ];
    }

    echo json_encode([
        'status' => 'success',
        'count' => count($mentions),
        'mentions' => $mentions
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Falha ao buscar feed de menções.',
        'details' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
