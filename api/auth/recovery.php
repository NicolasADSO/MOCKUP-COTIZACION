<?php
// api/auth/recovery.php
require_once '../config/db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email requerido']);
    exit;
}

try {
    // Verificar usuario
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        // Por seguridad, no decimos si existe o no, pero simulamos éxito
        echo json_encode(['success' => false, 'message' => 'Si el correo existe, se enviará un enlace.']);
        exit;
    }

    // Generar Token
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

    // Guardar en BD
    $update = $conn->prepare("UPDATE usuarios SET reset_token = :token, reset_expires = :expires WHERE id = :id");
    $update->execute([
        ':token' => $token,
        ':expires' => $expires,
        ':id' => $user['id']
    ]);

    // SIMULACIÓN DE ENVÍO (Entorno Local)
    // En producción aquí iría mail(...)
    
    // Obtener URL base
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];
    // Asumimos carpeta GADIER-PRODUCCION
    $path = "/GADIER-PRODUCCION/reset_password.html?token=$token";
    $link = "$protocol://$host$path";

    echo json_encode([
        'success' => true,
        'message' => 'Enlace generado (MODO DEV)',
        'debug_link' => $link
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error servidor: ' . $e->getMessage()]);
}
?>
