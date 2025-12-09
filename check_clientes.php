<?php
// check_clientes.php
require 'api/config/db.php';

echo "<h1>📋 Lista de Clientes en Base de Datos</h1>";
echo "<p>Si ves tus datos aquí, es que MySQL está guardando correctamente.</p>";
echo "<hr>";

try {
    $stmt = $conn->query("SELECT * FROM clientes ORDER BY id DESC");
    $clientes = $stmt->fetchAll();

    if (count($clientes) > 0) {
        echo "<table border='1' cellpadding='10' style='border-collapse:collapse; width:100%;'>";
        echo "<tr style='background:#eee;'><th>ID</th><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Creado</th></tr>";
        
        foreach ($clientes as $c) {
            echo "<tr>";
            echo "<td>" . $c['id'] . "</td>";
            echo "<td>" . $c['nombre_contacto'] . "</td>";
            echo "<td>" . $c['correo'] . "</td>";
            echo "<td>" . $c['telefono'] . "</td>";
            echo "<td>" . $c['created_at'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<h3>⚠️ La tabla 'clientes' está vacía.</h3>";
        echo "<p>Intenta guardar un cliente favorito desde cotizacion.html primero.</p>";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
