<?php
// Logout and disconnect from game
session_start();

if (isset($_SESSION['name'])) {
    $redis = new Redis();
    $redis->connect('localhost');
    $redis->hDel("players", $_SESSION['name']);
    $redis->zRem('players:leaderboard', $_SESSION['name']);
    $redis->close();
}

session_destroy();
header('Location: index.php');
exit();
?>