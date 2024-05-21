<?php
// Logout and disconnect from game
session_start();

$name = $_SESSION['name'];
if (isset($name)) {
    $redis = new Redis();
    $redis->connect('localhost');

    $redis->hDel("players", $name);
    $redis->zRem('players:leaderboard', $name);
    $redis->hDel("secrets", $name);
    $redis->del("ready:" . $name);

    $redis->close();
}

session_destroy();
header('Location: index.php');
exit();
?>