<?php
// API Endpoint de Verificação de Sessão - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . '/../config/database.php';
startSentinelaSession();

if (empty($_SESSION['sentinela_user_id'])) {
    http_response_code(401);
    echo json_encode([
        'authenticated' => false,
        'message' => 'Nenhuma sessão ativa encontrada.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("
        SELECT id, username, email, role, plan, plan_status, avatar_url, timezone, created_at 
        FROM `users` 
        WHERE id = :id AND deleted_at IS NULL
        LIMIT 1
    ");
    $stmt->execute([':id' => $_SESSION['sentinela_user_id']]);
    $user = $stmt->fetch();

    if (!$user) {
        session_destroy();
        http_response_code(401);
        echo json_encode(['authenticated' => false, 'message' => 'Usuário inexistente ou inativo.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode([
        'authenticated' => true,
        'user' => [
            'id' => (int) $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'plan' => $user['plan'],
            'plan_status' => $user['plan_status'],
            'avatar_url' => $user['avatar_url'],
            'timezone' => $user['timezone'],
            'created_at' => $user['created_at']
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['authenticated' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
