-- Base de Datos para Gadier Sistemas
-- Nombre sugerido: gadier_db

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

-- 1. Tabla de Usuarios (Administrativos y Cotizadores)
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL, -- Hash bcrypt
  `rol` enum('admin','cotizador','soporte','tecnica') NOT NULL DEFAULT 'cotizador',
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usuario Admin por defecto (Pass: 123456)
-- IMPORTANTE: Cambiar password en producción
INSERT INTO `usuarios` (`nombre`, `email`, `password`, `rol`) VALUES
('Administrador', 'admin@gadier.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- --------------------------------------------------------

-- 2. Tabla de Clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_contacto` varchar(100) NOT NULL,
  `empresa` varchar(150) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `tipo_identificacion` enum('NIT','CC','RUNT','Otro') DEFAULT 'NIT',
  `numero_identificacion` varchar(50) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- 3. Tabla de Cotizaciones
CREATE TABLE IF NOT EXISTS `cotizaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL, -- Ej: COT-2023-001
  `cliente_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `total_estimado` decimal(15,2) NOT NULL DEFAULT 0.00,
  `estado` enum('Borrador','Enviada','Aprobada','Rechazada') DEFAULT 'Borrador',
  `datos_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`datos_json`)), -- Snapshot completo
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `cliente_id` (`cliente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- 4. Tabla de Suministros (Maestra de precios)
CREATE TABLE IF NOT EXISTS `suministros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `referencia` varchar(50) DEFAULT NULL,
  `precio_unitario` decimal(12,2) NOT NULL,
  `tipo` enum('Papelería','Ferretería','Tecnología','Otro') DEFAULT 'Papelería',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- 5. Tabla de Configuración de Procesos (Precios base)
-- Reemplaza a procesos_data.js
CREATE TABLE IF NOT EXISTS `config_procesos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `area` varchar(50) NOT NULL, -- Archivístico, Bibliotecología
  `proceso` varchar(100) NOT NULL, -- Diagnóstico, Organización...
  `subproceso` varchar(150) NOT NULL, -- Áreas, Alistamiento...
  `valor_unitario` decimal(12,2) NOT NULL DEFAULT 0.00,
  `unidad_medida` varchar(50) DEFAULT NULL, -- Caja, Metro, Hora
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos semilla basados en procesos_data.js
INSERT INTO `config_procesos` (`area`, `proceso`, `subproceso`, `valor_unitario`) VALUES
('Archivístico', 'Diagnóstico', 'Áreas', 18000),
('Archivístico', 'Actualización de Archivos Electrónicos', 'Alistamiento', 18000),
('Archivístico', 'Actualización de Archivos Electrónicos', 'Indexación', 25000),
('Archivístico', 'Administración In House', 'Tiempo completo', 35000),
('Archivístico', 'Administración In House', 'Parcial', 22000),
('Archivístico', 'Alquiler de Equipos', 'Básicos', 12000),
('Archivístico', 'Alquiler de Equipos', 'Medios', 18000),
('Archivístico', 'Alquiler de Equipos', 'Especializados', 25000),
('Archivístico', 'Asesoría y cumplimiento de la ley', 'Registro de activos de información', 40000),
('Archivístico', 'Consultoría', 'Análisis de Requerimientos', 42000);

COMMIT;
