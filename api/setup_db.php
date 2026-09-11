<?php
// Script de Instalação e Inicialização do Banco de Dados Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/config/database.php';

try {
    $pdo = getDbConnection();
    
    $sqlFile = file_exists(__DIR__ . '/schema.sql') 
        ? __DIR__ . '/schema.sql' 
        : __DIR__ . '/database/schema.sql';
        
    if (file_exists($sqlFile)) {
        $sqlContent = file_get_contents($sqlFile);
        $pdo->exec($sqlContent);
    }
    
    // Garante as senhas criptografadas corretas dos usuários iniciais
    $marioHash = password_hash('mario2026', PASSWORD_DEFAULT);
    $adminHash = password_hash('sentinela2026', PASSWORD_DEFAULT);

    $userStmt = $pdo->prepare("
        INSERT INTO `users` (username, email, password_hash, role, plan, plan_status, avatar_url)
        VALUES 
        ('mariozinhocs', 'mariozinhocs@gmail.com', :marioHash, 'admin', 'enterprise', 'active', 'https://github.com/mariozinhocs.png'),
        ('admin', 'admin@sentinela.ai', :adminHash, 'admin', 'enterprise', 'active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')
        ON DUPLICATE KEY UPDATE 
        password_hash = VALUES(password_hash),
        role = VALUES(role),
        plan = VALUES(plan),
        plan_status = VALUES(plan_status)
    ");
    $userStmt->execute([
        ':marioHash' => $marioHash,
        ':adminHash' => $adminHash
    ]);

    // Verifica tabelas criadas
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo json_encode([
        'success' => true,
        'message' => 'Banco de Dados Sentinela instalado e tabelas criadas com sucesso!',
        'database' => DB_NAME,
        'tables' => $tables,
        'timestamp' => date('c')
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Falha ao executar o setup do banco de dados.',
        'details' => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
