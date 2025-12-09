<?php
// setup_db.php

// 1. Configuración manual (para evitar errores de conexión al db que aun no existe)
$host = 'localhost';
$db_name = 'gadier_db';
$username = 'root';
$password = '123456'; 

echo "🔌 Conectando a MySQL (sin seleccionar DB)..." . PHP_EOL;

try {
    // Conexión sin DBNAME para poder crearla
    $conn = new PDO("mysql:host=$host;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 2. Crear Base de Datos
    echo "🔨 Creando base de datos '$db_name' si no existe..." . PHP_EOL;
    $conn->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    // 3. Seleccionar la DB
    $conn->exec("USE `$db_name`");
    
    // 4. Leer y ejecutar schema.sql
    echo "📂 Leyendo esquema SQL..." . PHP_EOL;
    $sql = file_get_contents('database/schema.sql');
    if (!$sql) {
        die("❌ Error: No se pudo leer database/schema.sql");
    }

    echo "🚀 Ejecutando migración..." . PHP_EOL;
    $conn->exec($sql);
    
    echo "✅ ¡ÉXITO! Base de datos y tablas creadas correctamente." . PHP_EOL;
    echo "➡️  Ahora puedes hacer Login." . PHP_EOL;

} catch (PDOException $e) {
    echo "❌ Error Crítico: " . $e->getMessage() . PHP_EOL;
    exit(1);
}
?>
