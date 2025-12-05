<?php
// api/config/db.php

$host = 'localhost';
$db_name = 'gadier_db';
$username = 'root';
$password = '123456'; // XAMPP por defecto suele ser vacío

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    
    // Configurar modo de errores a excepción para debugging fácil
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Configurar fetch mode por defecto a Array Asociativo
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch(PDOException $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Error de conexión a la base de datos: " . $e->getMessage()
    ]);
    exit;
}
?>
