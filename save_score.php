<?php
require_once 'db_config.php';

$data = json_decode(file_get_contents("php://input"), true);
$score = intval($data['score']);

if ($score > 0) {
    $stmt = $conn->prepare("INSERT INTO scores (score) VALUES (?)");
    $stmt->bind_param("i", $score);
    $stmt->execute();
    $stmt->close();
}

$conn->close();
?>
