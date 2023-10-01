<?php
//is called from client-side JS when login is attempted: handles login-Request/returns 
  $username = $_SERVER["uname"];
  $password = $_SERVER["pword"];//Environment Variables
  $message = "Sorry, falsche Login-Daten.";

  if($_SERVER["REQUEST_METHOD"]=="POST"){
    if($_POST["pword"]==$password&&$_POST["uname"==$username]){
        header('Location: landing.php');
    }else{
        echo $message;
    }
  }