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
        <script src="resources/js/request_handler.js" defer></script>
        <script src="resources/js/requesting.js" defer></script>
        <script src="resources/js/termine.js" defer></script>
        <script src="resources/js/slotHandle.js" defer></script>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Termintool</title>
    </header>
    <body onload="fetchTermine(displayTermine)">
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
                    <div id="currentItem"><a class="listItem">Termine</a></div><br />
                    <a class="listItem" href="kunden.php">Kunden</a><br />
                    <a class="listItem" href="leistungen.php">Leistungen</a><br />
                    <button onclick = "checkFetching()">Insert testen</button>
            </div>
            <div id="terminContainer">
                
            </div>
        </div>
    </div>
    </div>
    </body> 
    <div id="terminModalBack"></div>
    <div id="terminModal">
        <h3>Achtung! Aktion nicht widerrufbar!</h3>
        <button class="modalButton" id="termineDeleteButton">Endgültig löschen</button><br />
        <button class= "modalButton" id="termineCloseButton">Abbrechen</button>
    </div>
</html>