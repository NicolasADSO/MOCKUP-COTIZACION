<?php
require 'api/config/db.php';
$hash = password_hash('123456', PASSWORD_DEFAULT);
$stmt = $conn->prepare("UPDATE usuarios SET password = :p WHERE email = 'admin@gadier.com'");
$stmt->execute([':p' => $hash]);
echo "✅ Password actualizado correctamente.";
?>
