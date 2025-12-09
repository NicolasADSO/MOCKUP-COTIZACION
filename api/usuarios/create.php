<?php
// api/usuarios/create.php
require_once '../config/db.php';
session_start();

header('Content-Type: application/json');

// 1. Seguridad: Login y Rol Admin
if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acceso denegado']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// 2. Validar Datos
$nombre = $data['nombre'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$rol = $data['rol'] ?? 'cotizador';

if (empty($nombre) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos requeridos']);
    exit;
}

try {
    // 3. Verificar si email existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = :email");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'El correo ya está registrado']);
        exit;
    }

    // 4. Crear Usuario
    $hash = password_hash($password, PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES (:nombre, :email, :pass, :rol, 1)";
    $insert = $conn->prepare($sql);
    $insert->execute([
        ':nombre' => $nombre,
        ':email' => $email,
        ':pass' => $hash,
        ':rol' => $rol
    ]);

    echo json_encode(['success' => true, 'message' => 'Usuario creado correctamente']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
