<?php
ob_start();
session_start();

if (isset($_SESSION['name'])) {
    header('Location: game.php');
    exit();
}

if (isset($_POST['name'])) {
    $name = htmlspecialchars($_POST['name']);

    $redis = new Redis();
    $redis->connect('localhost');

    if ($redis->hLen("players") >= $redis->lLen("colors")) {
        // The game is full
        $error = "La partie est pleine.";
        $redis->close();
    } else if ($redis->hExists("players", $name)) { // A player with this name already exists
        $error = "Ce pseudo est déjà utilisé.";
        $redis->close();
    } else { // Can connect to the game
        // Gets a random color and keep it in the list.
        $color = $redis->lIndex("colors", rand(0, $redis->lLen("colors") - 1));

        $redis->hSet("players", $name, $color);
        $redis->zAdd('players:leaderboard', 0, $name);
        $redis->close();
        $_SESSION["name"] = $name;
        header('Location: game.php');
        exit();
    }
}

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

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>

<div id="connection">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-center">
                    <img src="assets/img/logo.png" alt="logo" class="img-fluid">
                </div>
            </div>
        </div>

        <?php if (isset($error)): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Impossible de rejoindre la partie.</strong> <?= $error ?>.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>
        <form class="row g-3" action="" method="POST">
            <div class="d-flex justify-content-center">
                <div class="col-auto m-1">
                    <label for="name" class="visually-hidden">Pseudo</label>
                    <input type="text" class="form-control w-auto" name="name" id="name" placeholder="Pseudo" required>
                </div>
                <div class="col-auto m-1">
                    <button type="submit" class="btn btn-primary">Rejoindre la partie
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             class="bi bi-arrow-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>


<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
</body>
</html>