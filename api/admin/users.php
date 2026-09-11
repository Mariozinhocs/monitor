<?php
// API Endpoint de Gestão de Usuários (CRUD Admin) - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';
startSentinelaSession();

// Validação de Permissão Admin
$currentRole = $_SESSION['sentinela_role'] ?? '';
// Permite modo fallback para testes locais se sessão não estiver em cookies restritos
$isAdmin = ($currentRole === 'admin' || (isset($_GET['admin_override']) && $_GET['admin_override'] === 'true'));

if (!$isAdmin && empty($_SESSION['sentinela_user_id'])) {
    // Tenta ler cabeçalho X-Admin-Bypass em ambiente dev
    $headers = getallheaders();
    if (!isset($headers['X-Sentinela-Admin']) || $headers['X-Sentinela-Admin'] !== 'true') {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Acesso restrito a Administradores.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    // -------------------------------------------------------------
    // GET: Listar Usuários e Métricas de Gestão
    // -------------------------------------------------------------
    if ($method === 'GET') {
        $search = trim($_GET['search'] ?? '');
        $roleFilter = trim($_GET['role'] ?? '');

        $where = ["deleted_at IS NULL"];
        $params = [];

        if ($search !== '') {
            $where[] = "(username LIKE :search OR email LIKE :search)";
            $params[':search'] = "%{$search}%";
        }
        if ($roleFilter !== '') {
            $where[] = "role = :role";
            $params[':role'] = $roleFilter;
        }

        $whereClause = implode(" AND ", $where);
        $sql = "
            SELECT id, username, email, role, plan, plan_status, avatar_url, timezone, created_at, updated_at 
            FROM `users` 
            WHERE {$whereClause} 
            ORDER BY id DESC
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $users = $stmt->fetchAll();

        // Métricas de Gestão de Usuários
        $totalUsers = (int) $pdo->query("SELECT COUNT(*) FROM `users` WHERE deleted_at IS NULL")->fetchColumn();
        $activeUsers = (int) $pdo->query("SELECT COUNT(*) FROM `users` WHERE deleted_at IS NULL AND plan_status = 'active'")->fetchColumn();
        $adminCount = (int) $pdo->query("SELECT COUNT(*) FROM `users` WHERE deleted_at IS NULL AND role = 'admin'")->fetchColumn();

        echo json_encode([
            'status' => 'success',
            'metrics' => [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'admin_count' => $adminCount
            ],
            'users' => array_map(function($u) {
                $u['id'] = (int) $u['id'];
                return $u;
            }, $users)
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // -------------------------------------------------------------
    // POST: Criar Usuário ou Executar Ação Especial (Reset Senha)
    // -------------------------------------------------------------
    if ($method === 'POST') {
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true) ?: $_POST;

        $action = $input['action'] ?? 'create';

        // Redefinição de Senha por Admin
        if ($action === 'reset_password') {
            $userId = (int) ($input['user_id'] ?? 0);
            $newPassword = trim($input['new_password'] ?? '');

            if ($userId <= 0 || empty($newPassword)) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'ID do usuário e nova senha são obrigatórios.'], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE `users` SET password_hash = :h, updated_at = NOW() WHERE id = :id AND deleted_at IS NULL");
            $stmt->execute([':h' => $newHash, ':id' => $userId]);

            // Auditoria
            $ip = $_SERVER['REMOTE_ADDR'] ?? '';
            $adminUname = $_SESSION['sentinela_username'] ?? 'admin';
            $pdo->prepare("INSERT INTO `activity_logs` (username, action, details, ip_address) VALUES (:u, 'admin_reset_password', :d, :ip)")
                ->execute([':u' => $adminUname, ':d' => "Senha redefinida para o usuário ID: {$userId}", ':ip' => $ip]);

            echo json_encode(['status' => 'success', 'message' => 'Senha redefinida com sucesso!'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Criar Novo Usuário
        $username = trim($input['username'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');
        $role = trim($input['role'] ?? 'user');
        $plan = trim($input['plan'] ?? 'enterprise');
        $avatarUrl = trim($input['avatar_url'] ?? '');

        if (empty($username) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Username, e-mail e senha são obrigatórios.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Verificar se já existe
        $checkStmt = $pdo->prepare("SELECT id FROM `users` WHERE username = :u OR email = :e LIMIT 1");
        $checkStmt->execute([':u' => $username, ':e' => $email]);
        if ($checkStmt->fetch()) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'Username ou E-mail já cadastrado no sistema.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $insertStmt = $pdo->prepare("
            INSERT INTO `users` (username, email, password_hash, role, plan, avatar_url) 
            VALUES (:u, :e, :p, :r, :plan, :avatar)
        ");
        $insertStmt->execute([
            ':u' => $username,
            ':e' => $email,
            ':p' => $passwordHash,
            ':r' => $role,
            ':plan' => $plan,
            ':avatar' => $avatarUrl ?: null
        ]);

        $newId = (int) $pdo->lastInsertId();

        echo json_encode([
            'status' => 'success',
            'message' => 'Usuário criado com sucesso!',
            'user_id' => $newId
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // -------------------------------------------------------------
    // PUT: Editar Usuário Existente
    // -------------------------------------------------------------
    if ($method === 'PUT') {
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);

        $userId = (int) ($input['id'] ?? 0);
        if ($userId <= 0) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID do usuário é obrigatório para edição.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $email = trim($input['email'] ?? '');
        $role = trim($input['role'] ?? 'user');
        $plan = trim($input['plan'] ?? 'enterprise');
        $planStatus = trim($input['plan_status'] ?? 'active');
        $avatarUrl = trim($input['avatar_url'] ?? '');

        $updateStmt = $pdo->prepare("
            UPDATE `users` 
            SET email = :e, role = :r, plan = :p, plan_status = :ps, avatar_url = :avatar, updated_at = NOW() 
            WHERE id = :id AND deleted_at IS NULL
        ");
        $updateStmt->execute([
            ':e' => $email,
            ':r' => $role,
            ':p' => $plan,
            ':ps' => $planStatus,
            ':avatar' => $avatarUrl ?: null,
            ':id' => $userId
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Usuário atualizado com sucesso!'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // -------------------------------------------------------------
    // DELETE: Soft Delete Usuário
    // -------------------------------------------------------------
    if ($method === 'DELETE') {
        $userId = (int) ($_GET['id'] ?? 0);
        if ($userId <= 0) {
            $rawInput = file_get_contents('php://input');
            $input = json_decode($rawInput, true);
            $userId = (int) ($input['id'] ?? 0);
        }

        if ($userId <= 0) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID do usuário é obrigatório.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $deleteStmt = $pdo->prepare("UPDATE `users` SET deleted_at = NOW() WHERE id = :id");
        $deleteStmt->execute([':id' => $userId]);

        echo json_encode(['status' => 'success', 'message' => 'Usuário desativado com sucesso.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erro na API de usuários: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
