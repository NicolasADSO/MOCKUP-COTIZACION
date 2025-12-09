<?php
// api/usuarios/reset_pass.php
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
$newPass = $data['password'] ?? '';

if (!$id || empty($newPass)) {
    echo json_encode(['success' => false, 'message' => 'ID y nueva contraseña requeridos']);
    exit;
}

try {
    $hash = password_hash($newPass, PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("UPDATE usuarios SET password = :pass WHERE id = :id");
    $stmt->execute([':pass' => $hash, ':id' => $id]);

    echo json_encode(['success' => true, 'message' => 'Contraseña actualizada']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
