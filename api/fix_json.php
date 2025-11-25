<?php
header('Content-Type: application/json; charset=utf-8');
$input = json_decode(file_get_contents('php://input'), true);
$texto = $input['texto'] ?? '';

if (!$texto) {
  echo json_encode([]);
  exit;
}

// ============================================================
// 🔧 LIMPIEZA PROFUNDA (v2) — Desescapar, decodificar y validar
// ============================================================

// Extraer solo bloque JSON válido si hay ruido antes/después
if (preg_match('/\[[\s\S]*\]/', $texto, $match)) {
  $texto = $match[0];
}

// Eliminar secuencias escapadas visibles
$texto = str_replace(["\\n", "\\r", "\\t"], " ", $texto);
$texto = preg_replace('/\s{2,}/', ' ', $texto);
$texto = trim($texto);

// 🔹 Primera limpieza: convertir entidades unicode \u00xx a caracteres reales
$texto = preg_replace_callback(
  '/\\\\u00([0-9a-f]{2})/i',
  fn($m) => mb_convert_encoding(pack('H*', $m[1]), 'UTF-8', 'UCS-2BE'),
  $texto
);

// 🔹 Intentar decodificar directamente
$data = json_decode($texto, true);
if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  exit;
}

// 🔹 Segundo intento: quitar backslashes adicionales
$texto = stripslashes($texto);
$data = json_decode($texto, true);
if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  exit;
}

// 🔹 Último recurso: buscar objetos { ... } individuales
preg_match_all('/\{[\s\S]*?\}/', $texto, $objetos);
if (!empty($objetos[0])) {
  $resultado = [];
  foreach ($objetos[0] as $o) {
    $tmp = json_decode($o, true);
    if (is_array($tmp)) $resultado[] = $tmp;
  }
  if (!empty($resultado)) {
    echo json_encode($resultado, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
  }
}

// Si nada funcionó, devolver vacío
echo json_encode([]);
?>
