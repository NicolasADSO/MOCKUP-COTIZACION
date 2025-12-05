<?php
// api/auth/reset.php
require_once '../config/db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$token = $data['token'] ?? '';
$password = $data['password'] ?? '';

if (empty($token) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

try {
    // Verificar Token y Expiración
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE reset_token = :token AND reset_expires > NOW() LIMIT 1");
    $stmt->execute([':token' => $token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Token inválido o expirado']);
        exit;
    }

    // Hash Password
    $hash = password_hash($password, PASSWORD_DEFAULT);

    // Actualizar Password y borrar Token
    $update = $conn->prepare("UPDATE usuarios SET password = :pass, reset_token = NULL, reset_expires = NULL WHERE id = :id");
    $update->execute([
        ':pass' => $hash,
        ':id' => $user['id']
    ]);

    echo json_encode(['success' => true, 'message' => 'Contraseña actualizada correctamente']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error servidor: ' . $e->getMessage()]);
}
?>
