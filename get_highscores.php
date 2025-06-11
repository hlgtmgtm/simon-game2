<?php
require_once 'db_config.php';

$result = $conn->query("SELECT score FROM scores ORDER BY score DESC LIMIT 10");
$scores = [];

while ($row = $result->fetch_assoc()) {
    $scores[] = $row;
}

header('Content-Type: application/json');
echo json_encode($scores);

$conn->close();
?>
