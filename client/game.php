<?php
ob_start();
session_start();

if (!isset($_SESSION['name'])) {
    header('Location: index.php');
    exit();
}

$redis = new Redis();
$redis->connect('localhost');

//echo "<h1>Bienvenue " . $_SESSION['name'] . "</h1>";
//echo "<p>Vous êtes connecté.</p>";
//echo "<p>Il y a actuellement " . $redis->hLen("players") . " joueurs connectés.</p>";
//echo "<p>Il y a actuellement " . $redis->lLen("colors") . " couleurs disponibles.</p>";
//echo "<p>Votre couleur est " . $redis->hGet("players", $_SESSION['name']) . ".</p>";
//echo "<p>Voici la liste des joueurs connectés :</p>";
//echo "<ul>";
//foreach ($redis->hGetAll("players") as $player => $color) {
//    echo "<li>" . $player . " (" . $color . ")</li>";
//}
//echo "</ul>";
//echo "<p>Voici le classement des joueurs :</p>";
//echo "<ol>";
//foreach ($redis->zRevRange('players:leaderboard', 0, -1, true) as $player => $score) {
//    echo "<li>" . $player . " (" . $score . ")</li>";
//}
//echo "</ol>";
//echo "<a href='logout.php'>Se déconnecter</a>";
//$redis->close();

$step = 200;
$playersOffset = -$step;
?>


    <!doctype html>
    <html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!--    Favicon -->
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">

        <title>Moto Rapido</title>

        <link rel="stylesheet" href="assets/styles/game.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
              integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
              crossorigin="anonymous">
    </head>
    <body>

    <h1 id="name" class="text-center"><?= $_SESSION['name'] ?> <button id="ready" class="btn btn-danger">Prêt ❌</button> <a href="logout.php" class="btn btn-danger">Quitter la partie</a></h1>

    <div id="game" class="jeu">
        <!--    5 MOTOS MAX à 90%-->

        <?php foreach ($redis->hGetAll("players") as $player => $color): ?>
            <?php $score = $redis->zScore("players:leaderboard", $player) ?>
            <?php $ready = $redis->lPos("players:ready", $player);
            if ($ready != null) {
                $score = "Prêt ✅";
            } else {
                $score = "Prêt ❌";
            }
            ?>
            <div class="text-center moto" id="player-<?= $player ?>"
                 style="top: <?= $playersOffset += $step; ?>px; left: <?= $score ?>px;">
                <h3 id="player-name"><?= $player ?></h3>
                <img id="player-moto" src="assets/img/motos/<?= $color ?>.png" alt="Moto <?= $color ?>" width="90px">
                <p id="score"><?= $score ?></p>
            </div>
        <?php endforeach; ?>


    </div>

    <script src="assets/scripts/main.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
            crossorigin="anonymous"></script>
    </body>
    </html>


<?php
$redis->close();