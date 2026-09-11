<?php
// API Endpoint de Encerramento de Sessão (Logout) - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . '/../config/database.php';
startSentinelaSession();

$userId = $_SESSION['sentinela_user_id'] ?? null;
$username = $_SESSION['sentinela_username'] ?? null;

if ($userId) {
    try {
        $pdo = getDbConnection();
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $logStmt = $pdo->prepare("INSERT INTO `activity_logs` (user_id, username, action, details, ip_address) VALUES (:uid, :uname, 'user_logout', 'Sessão encerrada pelo usuário', :ip)");
        $logStmt->execute([':uid' => $userId, ':uname' => $username, ':ip' => $ip]);
    } catch (Exception $e) {
        // Log silencioso
    }
}

$_SESSION = [];
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
session_destroy();

echo json_encode([
    'status' => 'success',
    'message' => 'Sessão encerrada com sucesso.'
], JSON_UNESCAPED_UNICODE);
