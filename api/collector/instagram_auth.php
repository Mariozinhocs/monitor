<?php
// Endpoint de Autenticação Headless do Instagram - Sentinela.ai
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

startSentinelaSession();

$savedSessionFile = __DIR__ . '/../config/instagram_session.json';

// Se GET: Retorna o status de conexão da conta de serviço
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sessionData = file_exists($savedSessionFile) ? (json_decode(file_get_contents($savedSessionFile), true) ?: []) : [];
    $hasSession = !empty($sessionData['sessionid']);
    
    // Se tiver sessão, faz um teste rápido de liveness com o Instagram
    $isLive = false;
    $connectedUser = $sessionData['connected_username'] ?? null;

    if ($hasSession) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://www.instagram.com/api/v1/users/web_profile_info/?username=instagram");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 4);
        curl_setopt($ch, CURLOPT_HTTPHEADER, getInstagramRequestHeaders());
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $isLive = ($httpCode === 200);
    }

    echo json_encode([
        'status' => 'success',
        'has_session' => $hasSession,
        'is_live' => $isLive,
        'connected_username' => $connectedUser,
        'session_preview' => $hasSession ? substr($sessionData['sessionid'], 0, 8) . '...' : null,
        'updated_at' => $sessionData['updated_at'] ?? null
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Se POST: Realiza login headless ou verificação de 2FA
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;
    $action = $data['action'] ?? 'login';

    if ($action === 'login') {
        $username = trim($data['username'] ?? '');
        $password = trim($data['password'] ?? '');

        if (empty($username) || empty($password)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Informe o usuário e senha da conta do Instagram.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 1. Passo 1: Obtém o token CSRF inicial visitando a página inicial do Instagram
        $cookieJar = tempnam(sys_get_temp_dir(), 'ig_cookie_');
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://www.instagram.com/");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieJar);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieJar);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $html = curl_exec($ch);
        curl_close($ch);

        // Extrai csrftoken do arquivo de cookies
        $csrfToken = 'missing';
        if (file_exists($cookieJar)) {
            $cookieContent = file_get_contents($cookieJar);
            if (preg_match('/csrftoken\s+([a-zA-Z0-9_-]+)/', $cookieContent, $matches)) {
                $csrfToken = $matches[1];
            }
        }

        // 2. Passo 2: Executa requisição de Login AJAX no Instagram
        $time = time();
        $encPassword = "#PWD_INSTAGRAM_BROWSER:0:{$time}:{$password}";

        $postFields = http_build_query([
            'username' => $username,
            'enc_password' => $encPassword,
            'queryParams' => '{}',
            'optIntoOneTap' => 'false',
            'stopDeletionNonce' => '',
            'trustedDeviceRecords' => '{}'
        ]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://www.instagram.com/api/v1/web/accounts/login/ajax/");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieJar);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieJar);
        curl_setopt($ch, CURLOPT_TIMEOUT, 12);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'X-IG-App-ID: 936619743392459',
            'X-ASBD-ID: 129477',
            'X-CSRFToken: ' . $csrfToken,
            'X-Requested-With: XMLHttpRequest',
            'Referer: https://www.instagram.com/accounts/login/',
            'Origin: https://www.instagram.com',
            'Content-Type: application/x-www-form-urlencoded',
            'Accept: */*'
        ]);

        $response = curl_exec($ch);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $headers = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);
        $json = json_decode($body, true) ?: [];

        // Verifica se houve autenticação com sucesso
        if ($httpCode === 200 && !empty($json['authenticated']) && $json['authenticated'] === true) {
            // Extrai sessionid dos cookies salvos no cookieJar ou nos headers
            $cookieContent = file_exists($cookieJar) ? file_get_contents($cookieJar) : '';
            $sessionId = '';
            $dsUserId = $json['userId'] ?? '';

            if (preg_match('/sessionid\s+([^\s]+)/', $cookieContent, $m)) {
                $sessionId = $m[1];
            } elseif (preg_match('/sessionid=([^;]+)/', $headers, $m)) {
                $sessionId = $m[1];
            }

            if (!empty($sessionId)) {
                $sessionData = [
                    'sessionid' => $sessionId,
                    'ds_user_id' => $dsUserId,
                    'csrftoken' => $csrfToken,
                    'connected_username' => $username,
                    'updated_at' => date('Y-m-d H:i:s')
                ];
                file_put_contents($savedSessionFile, json_encode($sessionData, JSON_PRETTY_PRINT));
                @unlink($cookieJar);

                echo json_encode([
                    'status' => 'success',
                    'message' => "Autenticado com sucesso no Instagram como @{$username}!",
                    'connected_username' => $username,
                    'is_live' => true
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }

        // Se o Instagram exigiu verificação em duas etapas (2FA)
        if (!empty($json['two_factor_required']) && $json['two_factor_required'] === true) {
            $twoFactorInfo = $json['two_factor_info'] ?? [];
            $_SESSION['ig_2fa_identifier'] = $twoFactorInfo['two_factor_identifier'] ?? '';
            $_SESSION['ig_2fa_username'] = $username;
            $_SESSION['ig_2fa_cookie_jar'] = $cookieJar;

            echo json_encode([
                'status' => 'two_factor_required',
                'message' => 'O Instagram enviou um código de segurança. Digite o código de 6 dígitos para concluir:',
                'two_factor_identifier' => $twoFactorInfo['two_factor_identifier'] ?? '',
                'obfuscated_phone' => $twoFactorInfo['obfuscated_phone_number'] ?? 'seu número cadastrado'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        @unlink($cookieJar);
        $errorMsg = $json['message'] ?? 'Falha ao autenticar no Instagram. Verifique o usuário e senha.';
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => $errorMsg,
            'details' => $json
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Ação: Verificação de 2FA
    if ($action === 'verify_2fa') {
        $code = trim($data['code'] ?? '');
        $identifier = $data['two_factor_identifier'] ?? ($_SESSION['ig_2fa_identifier'] ?? '');
        $username = $data['username'] ?? ($_SESSION['ig_2fa_username'] ?? '');
        $cookieJar = $_SESSION['ig_2fa_cookie_jar'] ?? tempnam(sys_get_temp_dir(), 'ig_cookie_2fa_');

        if (empty($code) || empty($identifier)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Código de 2FA inválido.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $postFields = http_build_query([
            'username' => $username,
            'verificationCode' => $code,
            'identifier' => $identifier,
            'queryParams' => '{}',
            'trust_this_device' => '1'
        ]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://www.instagram.com/api/v1/web/accounts/login/ajax/two_factor/");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieJar);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieJar);
        curl_setopt($ch, CURLOPT_TIMEOUT, 12);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'X-IG-App-ID: 936619743392459',
            'X-Requested-With: XMLHttpRequest',
            'Referer: https://www.instagram.com/accounts/login/two_factor',
            'Content-Type: application/x-www-form-urlencoded'
        ]);

        $response = curl_exec($ch);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $headers = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);
        $json = json_decode($body, true) ?: [];

        if ($httpCode === 200 && !empty($json['authenticated']) && $json['authenticated'] === true) {
            $cookieContent = file_exists($cookieJar) ? file_get_contents($cookieJar) : '';
            $sessionId = '';
            if (preg_match('/sessionid\s+([^\s]+)/', $cookieContent, $m)) {
                $sessionId = $m[1];
            } elseif (preg_match('/sessionid=([^;]+)/', $headers, $m)) {
                $sessionId = $m[1];
            }

            if (!empty($sessionId)) {
                $sessionData = [
                    'sessionid' => $sessionId,
                    'ds_user_id' => $json['userId'] ?? '',
                    'connected_username' => $username,
                    'updated_at' => date('Y-m-d H:i:s')
                ];
                file_put_contents($savedSessionFile, json_encode($sessionData, JSON_PRETTY_PRINT));
                @unlink($cookieJar);

                echo json_encode([
                    'status' => 'success',
                    'message' => "Autenticação 2FA concluída! Conectado como @{$username}.",
                    'connected_username' => $username,
                    'is_live' => true
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }

        echo json_encode([
            'status' => 'error',
            'message' => $json['message'] ?? 'Código de verificação incorreto ou expirado.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
