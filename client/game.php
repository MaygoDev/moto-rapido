<?php
ob_start();
session_start();

if (!isset($_SESSION['name'])) {
    header('Location: index.php');
    exit();
}

echo "hello, ".$_SESSION['name']."!";

?>