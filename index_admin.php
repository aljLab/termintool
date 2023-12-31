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
        <script src="resources/js/requesting.js" defer></script>
        <script src="resources/js/request_handler.js" defer></script>
        <script src="resources/js/timemanagement.js" defer></script>
        <script src="resources/js/termine.js" defer></script>
        <script src="resources/js/slotHandle.js" defer></script>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Termintool</title>
    </header>
    <body onload ="setUpCalendar()">
    <div id="back">
        <div id="container">
        <div id="navbar">
            <div id="logo"><p style="margin-left:15px;font-weight: bold;">Naturheilpraxis Martina La Bonté</p></div>
            <div id="login"><a href="./server-side-php/logout.php"><img style = "width:25px;height:30px;margin:15px;" src="resources/images/logout_icon.png"></a></div>
        </div>
        <div id="maincontainer">
            <div id="sidebar">
                <br />
                   <div id = "currentItem"><a class="listItem" >Kalender</a></div><br />
                    <a class="listItem" href="time_management.php">Zeitmanagement</a><br />
                    <a class="listItem" href="termine.php">Termine</a><br />
                    <a class="listItem" href="kunden.php">Kunden</a><br />
                    <a class="listItem" href="leistungen.php">Leistungen</a><br />
                    <!--button onclick="sendMail()">Send Mail</button-->
            </div>
            <div id="calcontainer">
                <div id="calnav">
                    <div id="lbutton"></div>
                    <div id="weeksign"></div>
                    <div id="rbutton"></div>
                </div>
                <div id="days"></div>
            </div>
        </div>
    </div>
    </div>
    </body> 
</html>