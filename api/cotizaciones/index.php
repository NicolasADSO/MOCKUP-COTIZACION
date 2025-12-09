<?php
// api/cotizaciones/index.php
require_once '../config/db.php';
session_start();

header('Content-Type: application/json');

// Validar sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Acceso no autorizado']);
    exit;
}

// Parámetros de paginación
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$perPage = 20;
$offset = ($page - 1) * $perPage;

// Parámetros de filtro
$clienteId = isset($_GET['cliente_id']) ? (int)$_GET['cliente_id'] : null;
$fechaDesde = $_GET['fecha_desde'] ?? null;
$fechaHasta = $_GET['fecha_hasta'] ?? null;
$estado = $_GET['estado'] ?? null;
$usuarioId = isset($_GET['usuario_id']) ? (int)$_GET['usuario_id'] : null;
$buscar = $_GET['buscar'] ?? null;

try {
    // Construir query base
    $sql = "SELECT 
                c.id,
                c.codigo,
                c.cliente_id,
                cl.nombre_contacto as cliente_nombre,
                c.total_estimado,
                c.fecha_creacion,
                c.estado,
                u.nombre as usuario_nombre
            FROM cotizaciones c
            LEFT JOIN clientes cl ON c.cliente_id = cl.id
            LEFT JOIN usuarios u ON c.usuario_id = u.id
            WHERE 1=1";
    
    $params = [];
    
    // Aplicar filtros
    if ($clienteId) {
        $sql .= " AND c.cliente_id = :cliente_id";
        $params[':cliente_id'] = $clienteId;
    }
    
    if ($fechaDesde) {
        $sql .= " AND DATE(c.fecha_creacion) >= :fecha_desde";
        $params[':fecha_desde'] = $fechaDesde;
    }
    
    if ($fechaHasta) {
        $sql .= " AND DATE(c.fecha_creacion) <= :fecha_hasta";
        $params[':fecha_hasta'] = $fechaHasta;
    }
    
    if ($estado) {
        $sql .= " AND c.estado = :estado";
        $params[':estado'] = $estado;
    }
    
    if ($usuarioId) {
        $sql .= " AND c.usuario_id = :usuario_id";
        $params[':usuario_id'] = $usuarioId;
    }
    
    if ($buscar) {
        $sql .= " AND (c.codigo LIKE :buscar OR cl.nombre_contacto LIKE :buscar)";
        $params[':buscar'] = "%$buscar%";
    }
    
    // Contar total (sin paginación)
    $countSql = "SELECT COUNT(*) as total FROM ($sql) as subquery";
    $countStmt = $conn->prepare($countSql);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    
    // Ordenar y paginar
    $sql .= " ORDER BY c.fecha_creacion DESC LIMIT :limit OFFSET :offset";
    // Agregar datos_json al select para fallback
    $sql = str_replace("c.estado,", "c.estado, c.datos_json,", $sql);

    $params[':limit'] = $perPage;
    $params[':offset'] = $offset;
    
    $stmt = $conn->prepare($sql);
    
    // Bind params con tipos correctos
    foreach ($params as $key => $value) {
        if ($key === ':limit' || $key === ':offset') {
            $stmt->bindValue($key, $value, PDO::PARAM_INT);
        } else {
            $stmt->bindValue($key, $value);
        }
    }
    
    $stmt->execute();
    $rawCotizaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Procesar resultados para fallback de nombre cliente
    $cotizaciones = array_map(function($c) {
        // Si no hay nombre por JOIN, buscar en JSON
        if (empty($c['cliente_nombre']) && !empty($c['datos_json'])) {
            $json = json_decode($c['datos_json'], true);
            if (isset($json['cliente']['nombre'])) {
                $c['cliente_nombre'] = $json['cliente']['nombre'] . " (Manual)";
            }
        }
        // Limpiar JSON para no enviar data innecesaria al listado
        unset($c['datos_json']);
        return $c;
    }, $rawCotizaciones);
    
    echo json_encode([
        'success' => true,
        'data' => $cotizaciones,
        'pagination' => [
            'total' => (int)$total,
            'per_page' => $perPage,
            'current_page' => $page,
            'total_pages' => ceil($total / $perPage)
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener cotizaciones: ' . $e->getMessage()
    ]);
}
?>
