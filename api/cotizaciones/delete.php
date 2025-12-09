<?php
// api/cotizaciones/delete.php
require_once '../config/db.php';
session_start();

header('Content-Type: application/json');

// Validar sesión
if (!isset($_SESSION['usuario_id']) || !isset($_SESSION['usuario_rol'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

// Validar rol: solo admin y cotizador
$rolesPermitidos = ['admin', 'cotizador'];
if (!in_array($_SESSION['usuario_rol'], $rolesPermitidos)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'No tienes permisos para eliminar cotizaciones']);
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID requerido']);
    exit;
}

try {
    // Verificar que existe
    $checkStmt = $conn->prepare("SELECT id FROM cotizaciones WHERE id = :id");
    $checkStmt->execute([':id' => $id]);
    
    if (!$checkStmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Cotización no encontrada']);
        exit;
    }
    
    // Eliminar
    $stmt = $conn->prepare("DELETE FROM cotizaciones WHERE id = :id");
    $stmt->execute([':id' => $id]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Cotización eliminada'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al eliminar: ' . $e->getMessage()
    ]);
}
?>
