<?php
include 'db_config.php';

$sql = "SELECT score FROM highscores ORDER BY score DESC LIMIT 10";
$result = $conn->query($sql);

$scores = [];
while ($row = $result->fetch_assoc()) {
    $scores[] = $row;
}
echo json_encode($scores);

$conn->close();
?>
