<?php
    session_start();
    if(!isset($_SESSION["u"])){
        header("Location: server-side-php/login.php");
        exit;
    }
?>
<!DOCTYPE html>
<html>
    <header>
        <link href="resources/css/styles.css" rel = "stylesheet">
        <script src="resources/js/main.js" defer></script>
        <script src="resources/js/kunden.js" defer></script>
        <script src="resources/js/termine.js"></script>
        <script src="resources/js/request_handler.js"></script>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kundenübersicht</title>
    </header>
    <body onload="fetchKunden(fillKundenTabelle)">
    <div id="back">
        <div id="container">
        <div id="navbar">
            <div id="logo"><p style="margin-left:15px;font-weight: bold;">Naturheilpraxis Martina La Bonté</p></div>
            <div id="login"><a href="./index.html"><img style = "width:25px;height:30px;margin:15px;" src="resources/images/logout_icon.png"></a></div>
        </div>
        <div id="maincontainer">
            <div id="sidebar">
                <br />
                    <a class="listItem" href="index_admin.php">Kalender</a><br />
                    <a class="listItem" href="time_management.php">Zeitmanagement</a><br />
                    <a class="listItem" href="termine.php">Termine</a><br />
                    <div id="currentItem"><a class="listItem">Kunden</a></div><br />
                    <a class="listItem" href="leistungen.php">Leistungen</a><br />
                    <!--button onclick = "checkFetching()">testen</button-->
            </div>
            <div id="kundenContainer">
                <h2 style="text-align: center;width: 100%;">Kunden</h2>       
            </div>
        </div>
    </div>
    </div>
    </body> 
</html>