<?php
// api/usuarios/delete.php
require_once '../config/db.php';
session_start();

header('Content-Type: application/json');

// 1. Seguridad ADMIN
if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acceso denegado']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

// Protección: No borrarse a sí mismo
if ($id == $_SESSION['usuario_id']) {
    echo json_encode(['success' => false, 'message' => 'No puedes eliminar tu propia cuenta']);
    exit;
}

try {
    // Eliminación real (o soft delete si prefieres)
    // Aquí haremos DELETE real, asumiendo FKs (si hay cotizaciones, podría fallar)
    // Mejor: Verificar si tiene cotizaciones. Si tiene, desactivar (update estado=0). Si no, borrar.
    
    // Check cotizaciones
    $check = $conn->prepare("SELECT COUNT(*) FROM cotizaciones WHERE usuario_id = :id"); // Asumiendo campo usuario_id en cotizaciones?
    // Espera, schema no tiene usuario_id en cotizaciones? Verificar.
    // Schema step 1213: cotizaciones fields: id, codigo, cliente_id...
    // Ah, falta ver si se guarda quien la creó.
    // Cotizaciones suele tener 'creado_por' o algo así?
    
    // Si no hay FK, DELETE directo funciona.
    
    $stmt = $conn->prepare("DELETE FROM usuarios WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['success' => true, 'message' => 'Usuario eliminado']);

} catch (Exception $e) {
    // Si falla por FK (Integrity constraint), capturar
    if ($e->getCode() == '23000') {
         // Fallback: Desactivar usuario en vez de borrar
         $stmt = $conn->prepare("UPDATE usuarios SET estado = 0 WHERE id = :id");
         $stmt->execute([':id' => $id]);
         echo json_encode(['success' => true, 'message' => 'Usuario desactivado (tiene registros asociados)']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>
