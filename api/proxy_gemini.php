<?php
// ==========================================================
// 🌐 PROXY LOCAL PARA GEMINI API (Texto para presentaciones)
// Basado en la doc oficial: models.generateContent (v1beta)
// https://ai.google.dev/api/generate-content
// ==========================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

// 1) Preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

// 2) Configuración de la API
$apiKey = "AIzaSyCjbHC6tSN4VqP2Y2RWLQeuABTrufxf9Q8"; // tu clave
// Endpoint recomendado en la doc oficial (v1beta + gemini-2.0-flash)
$endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . $apiKey;

// 3) Leer JSON de entrada
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || !isset($data['prompt']) || trim($data['prompt']) === '') {
  echo json_encode([
    "ok"       => false,
    "response" => "Prompt vacío o JSON inválido."
  ]);
  exit;
}

$prompt = $data['prompt'];

// 4) Armar payload según la doc oficial
$payload = [
  "contents" => [
    [
      "parts" => [
        ["text" => $prompt]
      ]
    ]
  ]
];

// 5) Llamada cURL a Gemini
$ch = curl_init($endpoint);
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST           => true,
  CURLOPT_HTTPHEADER     => ["Content-Type: application/json"],
  CURLOPT_POSTFIELDS     => json_encode($payload),
  CURLOPT_TIMEOUT        => 30,
]);

$response = curl_exec($ch);
$error    = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 6) Manejo de errores de conexión
if ($error || !$response) {
  echo json_encode([
    "ok"       => false,
    "response" => "Error de conexión con Gemini: " . ($error ?: "Respuesta vacía"),
    "http"     => $httpCode
  ]);
  exit;
}

// 7) Parsear respuesta de Gemini
$decoded = json_decode($response, true);

if (!$decoded) {
  echo json_encode([
    "ok"       => false,
    "response" => "Respuesta no válida de Gemini.",
    "raw"      => $response
  ]);
  exit;
}

// 8) Extraer texto generado
$text = $decoded["candidates"][0]["content"]["parts"][0]["text"] ?? null;

// 9) Respuesta “normalizada” para tu frontend
echo json_encode([
  "ok"       => true,
  "response" => $text ?: "Sin respuesta generada.",
  "raw"      => $decoded
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
