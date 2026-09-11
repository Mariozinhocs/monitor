<?php
// Configuração de Conexão com o Banco de Dados Hostinger MySQL - Sentinela
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

define('DB_HOST', 'localhost');
define('DB_NAME', 'u576215103_sentinela');
define('DB_USER', 'u576215103_sentinela');
define('DB_PASS', '/ASNY@dvi8u');
define('DB_CHARSET', 'utf8mb4');

function startSentinelaSession() {
    if (session_status() === PHP_SESSION_NONE) {
        ini_set('session.cookie_httponly', 1);
        ini_set('session.use_only_cookies', 1);
        ini_set('session.cookie_samesite', 'Lax');
        session_start();
    }
}

function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Falha na conexão com o banco de dados Sentinela.',
                'details' => $e->getMessage()
            ]);
            exit;
        }
    }
    return $pdo;
}

