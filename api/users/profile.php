<?php
// API Endpoint de Perfil do Usuário - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';
startSentinelaSession();

$userId = $_SESSION['sentinela_user_id'] ?? null;
if (!$userId && isset($_GET['user_id'])) {
    $userId = (int) $_GET['user_id'];
}

if (!$userId) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Sessão expirada. Por favor, faça login novamente.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$pdo = getDbConnection();

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->prepare("
            SELECT id, username, email, role, plan, plan_status, avatar_url, timezone, created_at 
            FROM `users` 
            WHERE id = :id AND deleted_at IS NULL
            LIMIT 1
        ");
        $stmt->execute([':id' => $userId]);
        $user = $stmt->fetch();

        // Buscar últimos logs de atividade do próprio usuário
        $logsStmt = $pdo->prepare("
            SELECT action, details, ip_address, created_at 
            FROM `activity_logs` 
            WHERE user_id = :uid OR username = :uname 
            ORDER BY id DESC LIMIT 10
        ");
        $logsStmt->execute([':uid' => $userId, ':uname' => $user['username'] ?? '']);
        $logs = $logsStmt->fetchAll();

        echo json_encode([
            'status' => 'success',
            'user' => $user,
            'recent_activity' => $logs
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true) ?: $_POST;

        $email = trim($input['email'] ?? '');
        $avatarUrl = trim($input['avatar_url'] ?? '');
        $timezone = trim($input['timezone'] ?? 'America/Sao_Paulo');
        $currentPassword = trim($input['current_password'] ?? '');
        $newPassword = trim($input['new_password'] ?? '');

        // Atualizar Senha se informada
        if (!empty($newPassword)) {
            $stmt = $pdo->prepare("SELECT password_hash FROM `users` WHERE id = :id");
            $stmt->execute([':id' => $userId]);
            $userHash = $stmt->fetchColumn();

            if (!empty($currentPassword) && !password_verify($currentPassword, $userHash)) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'A senha atual informada está incorreta.'], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
            $pdo->prepare("UPDATE `users` SET password_hash = :h WHERE id = :id")->execute([':h' => $newHash, ':id' => $userId]);
        }

        // Atualizar dados cadastrais
        $updateStmt = $pdo->prepare("
            UPDATE `users` 
            SET email = :e, avatar_url = :avatar, timezone = :tz, updated_at = NOW() 
            WHERE id = :id
        ");
        $updateStmt->execute([
            ':e' => $email,
            ':avatar' => $avatarUrl ?: null,
            ':tz' => $timezone,
            ':id' => $userId
        ]);

        $_SESSION['sentinela_email'] = $email;

        echo json_encode(['status' => 'success', 'message' => 'Perfil atualizado com sucesso!'], JSON_UNESCAPED_UNICODE);
        exit;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erro ao processar dados do perfil: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
