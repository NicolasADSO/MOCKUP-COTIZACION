<?php
// api/usuarios/index.php
require_once '../config/db.php';
session_start();

header('Content-Type: application/json');

// 1. Seguridad: Login y Rol Admin
if (!isset($_SESSION['usuario_id']) || !isset($_SESSION['usuario_rol'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

if ($_SESSION['usuario_rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acceso denegado. Solo administradores.']);
    exit;
}

try {
    // 2. Consultar usuarios (sin password)
    $stmt = $conn->query("SELECT id, nombre, email, rol, estado, created_at FROM usuarios ORDER BY nombre ASC");
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true, 
        'data' => $usuarios
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
