<?php
// API Endpoint de Autenticação - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/database.php';
startSentinelaSession();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método não permitido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$rawInput = file_get_contents('php://input');
$rawInput = trim($rawInput, "\xEF\xBB\xBF \t\n\r\0\x0B");
$input = json_decode($rawInput, true);
if (!is_array($input) || empty($input)) {
    $input = $_POST;
}

$usernameOrEmail = trim($input['username'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($usernameOrEmail) || empty($password)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Por favor, informe o usuário/e-mail e a senha.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $pdo = getDbConnection();

    $stmt = $pdo->prepare("
        SELECT id, username, email, password_hash, role, plan, plan_status, avatar_url, timezone, deleted_at 
        FROM `users` 
        WHERE (username = :val1 OR email = :val2) 
        LIMIT 1
    ");
    $stmt->execute([
        ':val1' => $usernameOrEmail,
        ':val2' => $usernameOrEmail
    ]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Credenciais incorretas ou usuário não encontrado.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (!empty($user['deleted_at']) || $user['plan_status'] === 'suspended') {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Esta conta foi suspensa ou desativada.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (!password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Senha incorreta. Verifique se o Caps Lock está ativo.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Persistência da sessão PHP
    $_SESSION['sentinela_user_id'] = $user['id'];
    $_SESSION['sentinela_username'] = $user['username'];
    $_SESSION['sentinela_email'] = $user['email'];
    $_SESSION['sentinela_role'] = $user['role'];
    $_SESSION['sentinela_plan'] = $user['plan'];

    // Registrar log de auditoria (M.E.L.T.)
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $logStmt = $pdo->prepare("INSERT INTO `activity_logs` (user_id, username, action, details, ip_address) VALUES (:uid, :uname, 'user_login', :details, :ip)");
        $logStmt->execute([
            ':uid' => $user['id'],
            ':uname' => $user['username'],
            ':details' => json_encode(['email' => $user['email'], 'role' => $user['role']]),
            ':ip' => $ip
        ]);
    } catch (Exception $e) {
        // Ignora falha não-crítica de log
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Autenticado com sucesso no Sentinela.ai!',
        'user' => [
            'id' => (int) $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'plan' => $user['plan'],
            'avatar_url' => $user['avatar_url'],
            'timezone' => $user['timezone']
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erro interno ao autenticar: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
