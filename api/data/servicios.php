<?php
// api/data/servicios.php
require_once __DIR__ . '/../config/db.php';
session_start();

header('Content-Type: application/json');

// Validar sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Acceso no autorizado']);
    exit;
}

try {
    // 1. Obtener todos los procesos activos
    $stmt = $conn->query("SELECT * FROM config_procesos ORDER BY area, proceso, subproceso");
    $raw_data = $stmt->fetchAll();

    // 2. Estructurar datos como los espera el Frontend
    /*
       Frontend espera 2 objetos globales:
       - dataProcesos: { "Area": ["Proceso1", "Proceso2"] }
       - dataSubprocesos: { "Proceso1": [ {nombre: "Sub1", valor: 100}, ... ] }
    */

    $dataProcesos = [];
    $dataSubprocesos = [];

    foreach ($raw_data as $row) {
        $area = $row['area'];
        $proc = $row['proceso'];
        $sub = $row['subproceso'];
        $val = (float) $row['valor_unitario'];

        // Construir dataProcesos
        if (!isset($dataProcesos[$area])) {
            $dataProcesos[$area] = [];
        }
        if (!in_array($proc, $dataProcesos[$area])) {
            $dataProcesos[$area][] = $proc;
        }

        // Construir dataSubprocesos
        if (!isset($dataSubprocesos[$proc])) {
            $dataSubprocesos[$proc] = [];
        }
        $dataSubprocesos[$proc][] = [
            'nombre' => $sub,
            'valor' => $val,
            'unidad' => $row['unidad_medida'] // Extra: enviamos unidad si existe
        ];
    }

    echo json_encode([
        'dataProcesos' => $dataProcesos,
        'dataSubprocesos' => $dataSubprocesos
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
?>
