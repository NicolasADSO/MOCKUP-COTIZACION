<?php
// api/cotizaciones/get.php
require_once '../config/db.php';
session_start();

header('Content-Type: application/json');

$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID requerido']);
    exit;
}

try {
    $sql = "SELECT 
                c.*,
                cl.nombre_contacto as cliente_nombre,
                u.nombre as usuario_nombre
            FROM cotizaciones c
            LEFT JOIN clientes cl ON c.cliente_id = cl.id
            LEFT JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.id = :id";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([':id' => $id]);
    $cotizacion = $stmt->fetch();
    
    if (!$cotizacion) {
        echo json_encode(['success' => false, 'message' => 'Cotización no encontrada']);
        exit;
    }
    
    // Decodificar JSON
    $cotizacion['datos_json'] = json_decode($cotizacion['datos_json'], true);
    
    echo json_encode([
        'success' => true,
        'data' => $cotizacion
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener cotización: ' . $e->getMessage()
    ]);
}
?>
