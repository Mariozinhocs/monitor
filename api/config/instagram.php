<?php
// Configuração do Coletor de Sessão Instagram - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

// Cookie de Sessão do Instagram (Pode ser atualizado via painel admin ou arquivo)
$savedSessionFile = __DIR__ . '/instagram_session.json';
$sessionData = [];
if (file_exists($savedSessionFile)) {
    $sessionData = json_decode(file_get_contents($savedSessionFile), true) ?: [];
}

define('INSTAGRAM_SESSION_ID', $sessionData['sessionid'] ?? getenv('INSTAGRAM_SESSION_ID') ?: '');
define('INSTAGRAM_DS_USER_ID', $sessionData['ds_user_id'] ?? getenv('INSTAGRAM_DS_USER_ID') ?: '');
define('INSTAGRAM_CSRF_TOKEN', $sessionData['csrftoken'] ?? getenv('INSTAGRAM_CSRF_TOKEN') ?: '');

/**
 * Retorna os headers HTTP simulando uma sessão autenticada de navegador web
 */
function getInstagramRequestHeaders(): array {
    $sessionid = INSTAGRAM_SESSION_ID;
    $dsUserId = INSTAGRAM_DS_USER_ID;
    $csrftoken = INSTAGRAM_CSRF_TOKEN;

    $cookieHeader = "ig_did=; ig_nrcb=1; ";
    if (!empty($sessionid)) {
        $cookieHeader .= "sessionid={$sessionid}; ";
    }
    if (!empty($dsUserId)) {
        $cookieHeader .= "ds_user_id={$dsUserId}; ";
    }
    if (!empty($csrftoken)) {
        $cookieHeader .= "csrftoken={$csrftoken}; ";
    }

    return [
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'X-IG-App-ID: 936619743392459',
        'X-ASBD-ID: 129477',
        'X-Requested-With: XMLHttpRequest',
        'Referer: https://www.instagram.com/',
        'Accept: */*',
        'Accept-Language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Sec-Fetch-Dest: empty',
        'Sec-Fetch-Mode: cors',
        'Sec-Fetch-Site: same-origin',
        'Cookie: ' . trim($cookieHeader)
    ];
}
