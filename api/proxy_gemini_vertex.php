<?php
// ============================================================
// 🌐 PROXY LOCAL SEGURO PARA GEMINI 2.5 (Vertex AI Compatible)
// Evita CORS + con fallback automático entre modelos
// ============================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

$apiKey = "AIzaSyDJmUSh2E-8n6jPVzDDpwNsMbO5LIuQvBA"; // ⬅️ pon tu clave real aquí

// Modelos disponibles
$models = [
  "gemini-2.5-flash",                 // rápido y estable
  "gemini-2.5-flash-lite-preview-06-17", // liviano
  "gemini-2.5-pro-preview-03-25"     // avanzado
];

$input = file_get_contents("php://input");
$data = json_decode($input, true);
$prompt = $data["prompt"] ?? null;

if (!$prompt) {
  echo json_encode(["ok" => false, "response" => "Falta el prompt"]);
  exit;
}

$response = null;
foreach ($models as $model) {
  $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent?key=" . $apiKey;

  $body = json_encode([
    "contents" => [[
      "role" => "user",
      "parts" => [["text" => $prompt]]
    ]],
    "generationConfig" => [
      "temperature" => 0.9,
      "topP" => 0.95,
      "topK" => 64,
      "maxOutputTokens" => 4096
    ]
  ]);

  $ch = curl_init($endpoint);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_SSL_VERIFYPEER => true
  ]);

  $result = curl_exec($ch);
  $error  = curl_error($ch);
  curl_close($ch);

  if ($error) {
    $response = ["ok" => false, "response" => "Error CURL: $error"];
    break;
  }

  $decoded = json_decode($result, true);
  if (isset($decoded["candidates"][0]["content"]["parts"][0]["text"])) {
    $response = [
      "ok" => true,
      "model" => $model,
      "response" => $decoded["candidates"][0]["content"]["parts"][0]["text"]
    ];
    break; // ✅ éxito
  }

  // Si hay error 429 o modelo saturado, probar siguiente
  if (isset($decoded["error"]["code"]) && $decoded["error"]["code"] == 429) {
    continue;
  }

  // Si otro error grave
  $response = [
    "ok" => false,
    "response" => $decoded["error"]["message"] ?? "Error desconocido",
    "raw" => $decoded
  ];
  break;
}

// Si ningún modelo funcionó
if (!$response) {
  $response = ["ok" => false, "response" => "Ningún modelo respondió correctamente"];
}

echo json_encode($response);
?>
