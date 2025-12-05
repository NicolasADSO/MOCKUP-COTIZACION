<?php
// api/cotizaciones/save.php
require_once '../config/db.php';
session_start();

header('Content-Type: application/json');

// Validar sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Acceso no autorizado. Inicie sesión.']);
    exit;
}
$usuario_id = $_SESSION['usuario_id'];

// Recibir datos
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data recibido']);
    exit;
}

try {
    // Generar código autoincrementable o aleatorio
    // Ejemplo simple: COT-{AÑO}-{RANDOM}
    $year = date('Y');
    $rand = strtoupper(substr(uniqid(), -4));
    $codigo = "COT-$year-$rand";

    // Datos principales
    $clienteId = $data['cliente_id'] ?? null;
    $total = $data['total'] ?? 0;
    
    // El JSON completo se guarda tal cual para poder "reconstruir" la cotización
    $jsonSnapshot = json_encode($data);

    $sql = "INSERT INTO cotizaciones (codigo, cliente_id, usuario_id, total_estimado, datos_json) 
            VALUES (:codigo, :cliente_id, :usuario_id, :total, :json)";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':codigo' => $codigo,
        ':cliente_id' => $clienteId,
        ':usuario_id' => $usuario_id,
        ':total' => $total,
        ':json' => $jsonSnapshot
    ]);

    echo json_encode([
        'success' => true, 
        'message' => 'Cotización guardada',
        'id' => $conn->lastInsertId(),
        'codigo' => $codigo
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error DB: ' . $e->getMessage()]);
}
?>
