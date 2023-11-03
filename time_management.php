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
        <link href="./resources/css/styles.css" rel = "stylesheet">
        <script src="./resources/js/main.js" defer></script>
        <script src="./resources/js/timemanagement.js" defer></script>
        <script src="resources/js/requesting.js" defer></script>
        <script src="resources/js/request_handler.js" defer></script>
        <script src="resources/js/termine.js" defer></script>
        <script src="resources/js/slotHandle.js" defer></script>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Termintool</title>
    </header>
    <body onload="fetchBusinessHours(fetchTermine(setUpTimeManagement))">
    <div id="back">
        <div id="container">
        <div id="navbar">
            <div id="logo"><p style="margin-left:15px;font-weight: bold;">Naturheilpraxis Martina La Bonté</p></div>
            <div id="login"><a href="./index.html"><img style = "width:25px;height:30px;margin:15px;" src="./resources/images/logout_icon.png"></a></div>
        </div>
        <div id="maincontainer">
            <div id="sidebar">
                    <br />
                    <a class="listItem" href="index_admin.php">Kalender</a><br />
                    <div id="currentItem"><a class="listItem">Zeitmanagement</a></div><br />
                    <a class="listItem" href="termine.php">Termine</a><br />
                    <a class="listItem" href="kunden.php">Kunden</a><br />
                    <a class="listItem" href="leistungen.php">Leistungen</a><br />
                    <!--button onclick = "checkFetching()">testen</button-->
            </div>
            <div id="timecontainer">
                <div id="setBusinessHours">
                    <h4>Geschäftszeiten festlegen:</h4>
                    <p id="currentTimeDisplay"></p>
                    <table id="timeTable">
                        <tr id="thead">
                            <th>Tag</th>
                        </tr>
                        <tr id="tmo">
                            <td>Mo</td>
                        </tr>
                        <tr id="tdi">
                            <td>Di</td>
                        </tr>
                        <tr id="tmi">
                            <td>Mi</td>
                        </tr>
                        <tr id="tdon">
                            <td>Do</td>
                        </tr>
                        <tr id="tfr">
                            <td>Fr</td>
                        </tr>
                    </table>
                    <button id="updateBusinessHours" onclick="updateBusinessHours()">Geschäftszeiten ändern</button>
                    <span id="feedbackBusinessHours"></span>
                </div>
                <div id="makeReservation">
                    <h4>Termine blockieren:</h4>
                    <form id="makeReservationForm">
                    <div class="lineContainer">
                        <label class="dateInputLabel" for="reserveDay">Datum:</label>
                        <div class="dateContainer">
                            <input class="dateInputs" id ="reserveDay" name="day" type="text" size="4" placeholder="TT" pattern="[0-2]\d" required>.
                            <input class="dateInputs" id="reserveMonth" name ="month" type="text" size="4" placeholder="MM" pattern="(0|1)\d" required>.
                            <input class="dateInputs" id ="reserveYear" name = "year" type="text" size="6" placeholder="JJJJ" pattern ="\d{4}" required>
                        </div>    
                    </div><br />
                    <div class="lineContainer">
                        <label class="dateInputLabel" for="startTime"> Uhrzeit Beginn:</label>
                        <div class="dateContainer"> 
                            <input class="dateInputs" id ="startTime" name="startTime" type="text" size="6" placeholder="hh.mm" pattern="([0-2]?[0-9]\.[0,1,3,4][0,5])" required>
                        </div>
                    </div><br />
                    <div class="lineContainer">
                        <label class="dateInputLabel" for="endTime"> Uhrzeit Ende:</label>
                        <div class="dateContainer">
                            <input class="dateInputs" id="endTime" name="endTime" type="text" size="6" placeholder="hh.mm" pattern="([0-2]?[0-9]\.[0,1,3,4][0,5])" required>
                        </div>
                    </div><br />
                       <input type="button" name="sub" id="blockDateSubmit" value="Termin blockieren"><br />
                    </form>
                    <span id="feedbackBlockTermin"></span>
                    <!--button id="testBlockTermin" onclick="testBlockTermin()">Funktionalität testen</button-->
                </div>
            </div>
        </div>
    </div>
    </div>
    </body> 
</html>