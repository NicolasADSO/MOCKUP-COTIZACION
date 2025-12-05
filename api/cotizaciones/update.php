<?php
// api/cotizaciones/update.php
require_once '../config/db.php';
session_start();

header('Content-Type: application/json');

// Validar sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
    exit;
}

$id = (int)$data['id'];
$datosJson = isset($data['datos_json']) ? json_encode($data['datos_json']) : null;
$total = $data['total_estimado'] ?? null;
$estado = $data['estado'] ?? null;

try {
    // Construir UPDATE dinámico
    $updates = [];
    $params = [':id' => $id];
    
    if ($datosJson !== null) {
        $updates[] = "datos_json = :datos_json";
        $params[':datos_json'] = $datosJson;
    }
    
    if ($total !== null) {
        $updates[] = "total_estimado = :total";
        $params[':total'] = $total;
    }
    
    if ($estado !== null) {
        $updates[] = "estado = :estado";
        $params[':estado'] = $estado;
    }
    
    if (empty($updates)) {
        echo json_encode(['success' => false, 'message' => 'No hay datos para actualizar']);
        exit;
    }
    
    $sql = "UPDATE cotizaciones SET " . implode(', ', $updates) . " WHERE id = :id";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode([
        'success' => true,
        'message' => 'Cotización actualizada',
        'id' => $id
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al actualizar: ' . $e->getMessage()
    ]);
}
?>
