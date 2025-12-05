<?php
// api/auth/login.php
require_once '../config/db.php';

header('Content-Type: application/json');
session_start();

// Recibir datos JSON
$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email y contraseña requeridos']);
    exit;
}

try {
    // Buscar usuario por email
    $stmt = $conn->prepare("SELECT id, nombre, password, rol FROM usuarios WHERE email = :email AND estado = 1 LIMIT 1");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // ✅ Login Exitoso
        
        // Guardar sesión PHP (Seguro lado servidor)
        $_SESSION['usuario_id'] = $user['id'];
        $_SESSION['usuario_rol'] = $user['rol'];
        $_SESSION['usuario_nombre'] = $user['nombre'];

        // Responder al frontend
        echo json_encode([
            'success' => true,
            'message' => 'Login correcto',
            'usuario' => [
                'id' => $user['id'],
                'nombre' => $user['nombre'],
                'email' => $email,
                'rol' => $user['rol']
            ]
        ]);
    } else {
        // ❌ Login Fallido
        echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor']);
}
?>
