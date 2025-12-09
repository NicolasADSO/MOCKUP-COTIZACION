<?php
// check_cotizaciones.php
require 'api/config/db.php';

echo "<h1>📋 Historial de Cotizaciones (MySQL)</h1>";
echo "<p>Las cotizaciones generadas (PDF/PPT) aparecerán aquí.</p>";
echo "<hr>";

try {
    $stmt = $conn->query("
        SELECT c.*, cl.nombre_contacto as cliente_nombre 
        FROM cotizaciones c 
        LEFT JOIN clientes cl ON c.cliente_id = cl.id 
        ORDER BY c.id DESC
    ");
    $cots = $stmt->fetchAll();

    if (count($cots) > 0) {
        echo "<table border='1' cellpadding='10' style='border-collapse:collapse; width:100%;'>";
        echo "<tr style='background:#eee;'>
                <th>Código</th>
                <th>Cliente</th>
                <th>Creada</th>
                <th>Total</th>
                <th>Datos JSON</th>
              </tr>";
        
        foreach ($cots as $c) {
            echo "<tr>";
            echo "<td><b>" . $c['codigo'] . "</b></td>";
            echo "<td>" . ($c['cliente_nombre'] ?? 'Sin Cliente') . "</td>";
            echo "<td>" . $c['fecha_creacion'] . "</td>";
            echo "<td align='right'>$" . number_format($c['total_estimado'], 0) . "</td>";
            
            // Mostrar un poco del JSON para verificar
            $jsonPreview = substr($c['datos_json'], 0, 100) . "...";
            echo "<td style='font-size:12px; font-family:monospace; color:#555;'>" . htmlspecialchars($jsonPreview) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<h3>⚠️ No hay cotizaciones registradas.</h3>";
        echo "<p>Genera un PDF o PPT para crear una.</p>";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
