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
        <script src="resources/js/leistungen.js" defer></script>
        <script src="resources/js/slotHandle.js" defer></script>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Termintool</title>
    </header>
    <body onload="fillLeistungsTabelle()">
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
                    <a class="listItem" href="kunden.php">Kunden</a><br />
                    <div id="currentItem"><a class="listItem">Leistungen</a></div><br />
                    <!--button onclick = "checkFetching()">testen</button-->
            </div>
            <div id="leistungsContainer">
                <table id="leistungsTabelle">
                    <tr>
                        <th>Leistung</th>
                        <th>Dauer</th>
                        <th>Preis</th>
                        <!--th>Bearbeiten</th-->
                    </tr>
                </table>       
            </div>
        </div>
    </div>
    </div>
    </body> 
</html>