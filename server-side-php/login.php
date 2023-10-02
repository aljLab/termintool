<?php
    session_start();
    $n = $_SERVER['admin'];//env Variable
    $p = $_SERVER['adminpassword'];
    $name = "";
    $ErrorMessage="";
    if($_SERVER["REQUEST_METHOD"]=="POST"){
        $name = $_POST["name"];
        if($_POST["name"]==$n){
            if($_POST["pword"]==$p){
                    $LOGGED_IN = true;
                    $_SESSION["name"]=$name;
                    header("Location: ../index_admin.html");
            }else{
                $ErrorMessage="* Falsches Passwort";
            }
        }else{
            $ErrorMessage="* Falscher Nutzername";
            echo "ist: $n und {$_SERVER['admin']} ist die env";
            echo "ist: $p und {$_SERVER['adminpassword']} ist die env";
            $host = $_SERVER["HTTP_HOST"];
            echo "Der Host sollte 443 sein, er ist $host";
        }
    }
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href = "../resources/css/styles.css" rel = "stylesheet">
    <title>Login</title>
</head>
<body>
    <div id ="back">
        <div id="loginbox">
        <h3>Login</h3>
        <form id="mailform" method = "POST">
            Nutzername:<br /><input type = "text" name="name" value = <?=$name?>><br />
            Passwort:<br /><input type="password" name = "pword"><br />
            <input type="submit" name="submit" value = "Login"><br/>
         </form>
            <span id="feedback"><?=$ErrorMessage?></span>
        </div>
    </div>
</body>
</html>