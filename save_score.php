<?php
include 'db_config.php';

if (isset($_POST['score'])) {
    $score = intval($_POST['score']);
    $stmt = $conn->prepare("INSERT INTO highscores (score) VALUES (?)");
    $stmt->bind_param("i", $score);
    $stmt->execute();
    $stmt->close();
}
$conn->close();
?>
