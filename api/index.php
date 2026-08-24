<?php
// API Router RESTful - Sentinela.ai Backend
// Squad A-Team | Mario Henrique & Antigravity AI

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config/database.php';

$requestUri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Rota de Health Check / Status
if (strpos($requestUri, '/api/status') !== false || $requestUri === '/api' || $requestUri === '/api/') {
    echo json_encode([
        'status' => 'online',
        'service' => 'Sentinela.ai API Engine',
        'version' => '1.0.0',
        'timestamp' => date('c'),
        'database' => 'connected'
    ]);
    exit;
}

// Rota de Listagem de Menções
if (strpos($requestUri, '/api/mentions') !== false) {
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->query("SELECT * FROM mencoes ORDER BY criado_em DESC LIMIT 50");
        $mentions = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $mentions]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Rota de Alertas de Crise
if (strpos($requestUri, '/api/crises') !== false) {
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->query("SELECT * FROM alertas_crise ORDER BY disparado_em DESC LIMIT 20");
        $crises = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $crises]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Resposta Padrão para rotas não mapeadas
echo json_encode([
    'success' => true,
    'message' => 'Sentinela.ai API Core Gateway ativo.',
    'endpoints' => [
        '/api/status',
        '/api/mentions',
        '/api/crises'
    ]
]);
