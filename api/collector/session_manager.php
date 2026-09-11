<?php
// Gerenciador de Sessão Instagram - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/instagram.php';
require_once __DIR__ . '/instagram.php';

startSentinelaSession();

// Se GET: Verifica status da sessão atual
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $hasSession = !empty(INSTAGRAM_SESSION_ID);
    
    echo json_encode([
        'status' => 'success',
        'has_session' => $hasSession,
        'session_preview' => $hasSession ? substr(INSTAGRAM_SESSION_ID, 0, 8) . '...' : null,
        'ds_user_id' => INSTAGRAM_DS_USER_ID,
        'message' => $hasSession ? 'Sessão do Instagram configurada.' : 'Nenhuma sessão configurada.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Se POST: Atualiza os dados de sessão
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    $sessionId = trim($data['sessionid'] ?? '');
    $dsUserId = trim($data['ds_user_id'] ?? '');
    $csrfToken = trim($data['csrftoken'] ?? '');

    if (empty($sessionId)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'O campo sessionid é obrigatório.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Se o usuário colou o cookie inteiro ("sessionid=xyz; ds_user_id=123; ..."), faz o parsing inteligente
    if (strpos($sessionId, 'sessionid=') !== false || strpos($sessionId, ';') !== false) {
        $parts = explode(';', $sessionId);
        foreach ($parts as $part) {
            $part = trim($part);
            if (strpos($part, 'sessionid=') === 0) {
                $sessionId = substr($part, 10);
            } elseif (strpos($part, 'ds_user_id=') === 0 && empty($dsUserId)) {
                $dsUserId = substr($part, 11);
            } elseif (strpos($part, 'csrftoken=') === 0 && empty($csrfToken)) {
                $csrfToken = substr($part, 10);
            }
        }
    }

    $sessionData = [
        'sessionid' => $sessionId,
        'ds_user_id' => $dsUserId,
        'csrftoken' => $csrfToken,
        'updated_at' => date('Y-m-d H:i:s')
    ];

    $savedSessionFile = __DIR__ . '/../config/instagram_session.json';
    file_put_contents($savedSessionFile, json_encode($sessionData, JSON_PRETTY_PRINT));

    echo json_encode([
        'status' => 'success',
        'message' => 'Credenciais de sessão do Instagram salvas com sucesso!',
        'session_data' => [
            'sessionid_preview' => substr($sessionId, 0, 8) . '...',
            'ds_user_id' => $dsUserId,
            'updated_at' => $sessionData['updated_at']
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
