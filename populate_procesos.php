<?php
// populate_procesos.php
require 'api/config/db.php';

$data = [
    // Archivístico
    ['area' => 'Archivístico', 'proceso' => 'Diagnóstico', 'subproceso' => 'Áreas', 'valor' => 18000],
    
    ['area' => 'Archivístico', 'proceso' => 'Actualización de Archivos Electrónicos', 'subproceso' => 'Alistamiento', 'valor' => 18000],
    ['area' => 'Archivístico', 'proceso' => 'Actualización de Archivos Electrónicos', 'subproceso' => 'Indexación', 'valor' => 25000],

    ['area' => 'Archivístico', 'proceso' => 'Administración In House', 'subproceso' => 'Tiempo completo', 'valor' => 35000],
    ['area' => 'Archivístico', 'proceso' => 'Administración In House', 'subproceso' => 'Parcial', 'valor' => 22000],

    ['area' => 'Archivístico', 'proceso' => 'Alquiler de Equipos', 'subproceso' => 'Básicos', 'valor' => 12000],
    ['area' => 'Archivístico', 'proceso' => 'Alquiler de Equipos', 'subproceso' => 'Medios', 'valor' => 18000],
    ['area' => 'Archivístico', 'proceso' => 'Alquiler de Equipos', 'subproceso' => 'Especializados', 'valor' => 25000],

    ['area' => 'Archivístico', 'proceso' => 'Asesoría y cumplimiento de la ley', 'subproceso' => 'Registro de activos de información', 'valor' => 40000],
    ['area' => 'Archivístico', 'proceso' => 'Asesoría y cumplimiento de la ley', 'subproceso' => 'Índice de información clasificada y reservada', 'valor' => 45000],
    ['area' => 'Archivístico', 'proceso' => 'Asesoría y cumplimiento de la ley', 'subproceso' => 'Esquema de publicación de infomración', 'valor' => 50000],

    ['area' => 'Archivístico', 'proceso' => 'Consultoría', 'subproceso' => 'Análisis de Requerimientos', 'valor' => 42000],
    ['area' => 'Archivístico', 'proceso' => 'Consultoría', 'subproceso' => 'Diseño de Políticas Documentales', 'valor' => 48000],
    ['area' => 'Archivístico', 'proceso' => 'Consultoría', 'subproceso' => 'Gestión de Riesgos Archivísticos', 'valor' => 46000],
    ['area' => 'Archivístico', 'proceso' => 'Consultoría', 'subproceso' => 'Evaluación de Cumplimiento', 'valor' => 44000],

    ['area' => 'Archivístico', 'proceso' => 'Elaboración de Instrumentos Archivísticos', 'subproceso' => 'PINAR', 'valor' => 18000],
    ['area' => 'Archivístico', 'proceso' => 'Elaboración de Instrumentos Archivísticos', 'subproceso' => 'TRD-CCD', 'valor' => 25000],
    ['area' => 'Archivístico', 'proceso' => 'Elaboración de Instrumentos Archivísticos', 'subproceso' => 'INVENTARIOS', 'valor' => 20000],
    ['area' => 'Archivístico', 'proceso' => 'Elaboración de Instrumentos Archivísticos', 'subproceso' => 'TVD', 'valor' => 22000],
    ['area' => 'Archivístico', 'proceso' => 'Elaboración de Instrumentos Archivísticos', 'subproceso' => 'PGD', 'valor' => 30000],
    ['area' => 'Archivístico', 'proceso' => 'Elaboración de Instrumentos Archivísticos', 'subproceso' => 'ID', 'valor' => 27000],
    ['area' => 'Archivístico', 'proceso' => 'Elaboración de Instrumentos Archivísticos', 'subproceso' => 'RGD', 'valor' => 25000],
    ['area' => 'Archivístico', 'proceso' => 'Elaboración de Instrumentos Archivísticos', 'subproceso' => 'MPA', 'valor' => 32000],

    ['area' => 'Archivístico', 'proceso' => 'Organización', 'subproceso' => 'Clasificacion', 'valor' => 22000],
    ['area' => 'Archivístico', 'proceso' => 'Organización', 'subproceso' => 'Ordenación', 'valor' => 24000],
    ['area' => 'Archivístico', 'proceso' => 'Organización', 'subproceso' => 'Descripción', 'valor' => 28000],

    ['area' => 'Archivístico', 'proceso' => 'Consultas', 'subproceso' => 'En sede con transporte', 'valor' => 25000],
    ['area' => 'Archivístico', 'proceso' => 'Consultas', 'subproceso' => 'En sede sin transporte', 'valor' => 15000],
    ['area' => 'Archivístico', 'proceso' => 'Consultas', 'subproceso' => 'Fisica urgente con transporte', 'valor' => 35000],
    ['area' => 'Archivístico', 'proceso' => 'Consultas', 'subproceso' => 'Fisica urgente sin transporte', 'valor' => 20000],
    ['area' => 'Archivístico', 'proceso' => 'Consultas', 'subproceso' => 'Fisica normal con transporte', 'valor' => 22000],
    ['area' => 'Archivístico', 'proceso' => 'Consultas', 'subproceso' => 'Fisica normal sin transporte', 'valor' => 12000],
    ['area' => 'Archivístico', 'proceso' => 'Consultas', 'subproceso' => 'Digital', 'valor' => 8000],

    ['area' => 'Archivístico', 'proceso' => 'Traslado de archivos', 'subproceso' => 'Cajas', 'valor' => 15000],

    ['area' => 'Archivístico', 'proceso' => 'Depuración', 'subproceso' => 'Servicio de depuración documental', 'valor' => 20000],

    ['area' => 'Archivístico', 'proceso' => 'Eliminación', 'subproceso' => 'Servicio de eliminación documental', 'valor' => 20000],

    ['area' => 'Archivístico', 'proceso' => 'Custodia', 'subproceso' => 'Recepción y verificación de fondos documentales', 'valor' => 20000],
    ['area' => 'Archivístico', 'proceso' => 'Custodia', 'subproceso' => 'Clasificación por series y unidades de conservación', 'valor' => 22000],
    ['area' => 'Archivístico', 'proceso' => 'Custodia', 'subproceso' => 'Rotulación y codificación de cajas o contenedores', 'valor' => 21000],
    ['area' => 'Archivístico', 'proceso' => 'Custodia', 'subproceso' => 'Ingreso en sistema de control de depósitos', 'valor' => 23000],
    ['area' => 'Archivístico', 'proceso' => 'Custodia', 'subproceso' => 'Ubicación física en estantería o depósito', 'valor' => 20000],
    ['area' => 'Archivístico', 'proceso' => 'Custodia', 'subproceso' => 'Seguimiento y control periódico de conservación', 'valor' => 24000],
    ['area' => 'Archivístico', 'proceso' => 'Custodia', 'subproceso' => 'Entrega o retiro bajo acta de custodia', 'valor' => 25000],

    // Bibliotecología (Ejemplo base si existiera, o vacío)
    ['area' => 'Bibliotecología', 'proceso' => 'Proceso personalizado', 'subproceso' => 'Servicio General', 'valor' => 0],
];

echo "🔄 Iniciando carga masiva de procesos...\n";

// Primero limpiamos la tabla para evitar duplicados si ya existen parcialmente
$conn->exec("TRUNCATE TABLE config_procesos");
echo "🗑️  Tabla config_procesos limpiada.\n";

$sql = "INSERT INTO config_procesos (area, proceso, subproceso, valor_unitario) VALUES (:area, :proceso, :subproceso, :valor)";
$stmt = $conn->prepare($sql);

foreach ($data as $item) {
    $stmt->execute([
        ':area' => $item['area'],
        ':proceso' => $item['proceso'],
        ':subproceso' => $item['subproceso'],
        ':valor' => $item['valor']
    ]);
    echo "  ➕ Insertado: {$item['proceso']} - {$item['subproceso']}\n";
}

echo "✅ ¡Carga completa! Total: " . count($data) . " items.\n";
?>
