-- ==========================================================
-- SQL Schema para Hostinger MySQL (u576215103_monitor) - Sentinela.ai
-- Squad A-Team | Mario Henrique & Antigravity AI
-- Compatível com phpMyAdmin e MySQL 5.7+ / 8.0+ / MariaDB
-- ==========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tabela de Marcas Monitoradas
CREATE TABLE IF NOT EXISTS `marcas` (
  `id` VARCHAR(36) PRIMARY KEY,
  `nome` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) UNIQUE NOT NULL,
  `reputation_score` INT DEFAULT 80,
  `total_mentions` INT DEFAULT 0,
  `reach_estimate` BIGINT DEFAULT 0,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela de Menções (Social Listening Posts)
CREATE TABLE IF NOT EXISTS `mencoes` (
  `id` VARCHAR(36) PRIMARY KEY,
  `marca_id` VARCHAR(36) NULL,
  `canal` ENUM('instagram', 'tiktok', 'twitter', 'youtube', 'news', 'reddit') NOT NULL,
  `autor_nome` VARCHAR(150) NOT NULL,
  `autor_username` VARCHAR(150) NOT NULL,
  `autor_avatar` TEXT NULL,
  `autor_verificado` TINYINT(1) DEFAULT 0,
  `autor_seguidores` INT DEFAULT 0,
  `conteudo` TEXT NOT NULL,
  `media_url` TEXT NULL,
  `media_tipo` ENUM('image', 'video', 'audio', 'none') DEFAULT 'none',
  `transcricao_ia` TEXT NULL,
  `curtidas` INT DEFAULT 0,
  `comentarios` INT DEFAULT 0,
  `compartilhamentos` INT DEFAULT 0,
  `sentimento` ENUM('positive', 'neutral', 'negative', 'critical') NOT NULL,
  `sentimento_score` DECIMAL(4,3) DEFAULT 0.500,
  `nivel_risco` ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'low',
  `topicos_json` JSON NULL,
  `ai_resumo` TEXT NULL,
  `ai_emocao` VARCHAR(80) NULL,
  `ai_acao_sugerida` TEXT NULL,
  `publicado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_canal` (`canal`),
  INDEX `idx_sentimento` (`sentimento`),
  INDEX `idx_nivel_risco` (`nivel_risco`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabela de Alertas de Crise
CREATE TABLE IF NOT EXISTS `alertas_crise` (
  `id` VARCHAR(36) PRIMARY KEY,
  `marca_id` VARCHAR(36) NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `descricao` TEXT NOT NULL,
  `severidade` ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
  `canal` ENUM('instagram', 'tiktok', 'twitter', 'youtube', 'news', 'reddit') NOT NULL,
  `taxa_rejeicao` INT DEFAULT 0,
  `status` ENUM('active', 'investigating', 'resolved') NOT NULL DEFAULT 'active',
  `acao_recomendada` TEXT NOT NULL,
  `topicos_afetados_json` JSON NULL,
  `disparado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `resolvido_em` TIMESTAMP NULL,
  INDEX `idx_status` (`status`),
  INDEX `idx_severidade` (`severidade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabela de Regras de Automação & Gatilhos
CREATE TABLE IF NOT EXISTS `regras_gatilho` (
  `id` VARCHAR(36) PRIMARY KEY,
  `nome` VARCHAR(200) NOT NULL,
  `condicao` VARCHAR(255) NOT NULL,
  `acao_automatica` VARCHAR(255) NOT NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserção de Dados Iniciais da Marca
INSERT INTO `marcas` (`id`, `nome`, `slug`, `reputation_score`, `total_mentions`, `reach_estimate`)
VALUES ('mrc-001', 'Sentinela Brand Tech', 'sentinela', 84, 14280, 2850000)
ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`);

SET FOREIGN_KEY_CHECKS = 1;
