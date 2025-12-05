<?php
// api/clientes/save.php
require_once '../config/db.php';

header('Content-Type: application/json');

// Recibir JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data recibido']);
    exit;
}

// Extraer campos clave
// Nota: En DB los campos son snake_case (nombre_contacto), en Frontend camelCase (nombre).
// Haremos el mapeo aquí.

$nombre = $data['nombre'] ?? '';
$empresa = $data['empresa'] ?? ''; // Opcional en frontend actual pero útil
$correo = $data['correo'] ?? '';
$telefono = $data['telefono'] ?? '';
$destinatario = $data['destinatario'] ?? ''; // Es un campo "Dirigido a" que a veces se usa como contacto

// Sanitizar Tipo de Identificación para evitar error ENUM
$rawTipo = $data['tipoIdent'] ?? '';
$tipoIdent = 'NIT'; // Default

if ($rawTipo === 'Documento de identidad') {
    $tipoIdent = 'CC'; // Fix para caché antiguo del frontend
} elseif (!empty($rawTipo)) {
    // Validar contra lista blanca
    $allowed = ['NIT', 'CC', 'RUNT', 'Otro'];
    if (in_array($rawTipo, $allowed)) {
        $tipoIdent = $rawTipo;
    } else {
        $tipoIdent = 'Otro'; // Fallback si llega algo raro que no es vacío
    }
}
// Si llega vacío (""), se queda en 'NIT'.

$numeroIdent = $data['numeroIdent'] ?? '';

// Validación básica
if (empty($correo)) {
    echo json_encode(['success' => false, 'message' => 'El correo es obligatorio para identificar al cliente']);
    exit;
}

try {
    // 1. Verificar si ya existe por correo (Upsert logic simple)
    $stmt = $conn->prepare("SELECT id FROM clientes WHERE correo = :correo LIMIT 1");
    $stmt->execute([':correo' => $correo]);
    $existe = $stmt->fetch();

    if ($existe) {
        // ACTUALIZAR
        $sql = "UPDATE clientes SET 
                nombre_contacto = :nombre,
                telefono = :telefono,
                tipo_identificacion = :tipoIdent,
                numero_identificacion = :numeroIdent
                WHERE id = :id";
        
        $updateStmt = $conn->prepare($sql);
        $updateStmt->execute([
            ':nombre' => $nombre,
            ':telefono' => $telefono,
            ':tipoIdent' => $tipoIdent,
            ':numeroIdent' => $numeroIdent,
            ':id' => $existe['id']
        ]);

        echo json_encode(['success' => true, 'message' => 'Cliente actualizado', 'id' => $existe['id']]);

    } else {
        // CREAR
        // Usamos nombre o destinatario como nombre_contacto preferido
        $finalNombre = !empty($nombre) ? $nombre : $destinatario;

        $sql = "INSERT INTO clientes (nombre_contacto, correo, telefono, tipo_identificacion, numero_identificacion) 
                VALUES (:nombre, :correo, :telefono, :tipoIdent, :numeroIdent)";
        
        $insertStmt = $conn->prepare($sql);
        $insertStmt->execute([
            ':nombre' => $finalNombre,
            ':correo' => $correo,
            ':telefono' => $telefono,
            ':tipoIdent' => $tipoIdent,
            ':numeroIdent' => $numeroIdent
        ]);

        echo json_encode(['success' => true, 'message' => 'Cliente creado', 'id' => $conn->lastInsertId()]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error DB: ' . $e->getMessage()]);
}
?>
