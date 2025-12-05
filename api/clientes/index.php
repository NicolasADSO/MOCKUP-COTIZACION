<?php
// api/clientes/index.php
require_once __DIR__ . '/../config/db.php';
session_start();

header('Content-Type: application/json');

// Validar sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Acceso no autorizado']);
    exit;
}

try {
    // Ordenar por nombre
    $stmt = $conn->query("SELECT * FROM clientes ORDER BY nombre_contacto ASC");
    $clientes = $stmt->fetchAll();

    echo json_encode($clientes);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
?>
