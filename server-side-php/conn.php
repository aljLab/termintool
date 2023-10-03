<?php
    $dns ="mysql:host=localhost;dbname=termintool";
    $user = $_SERVER["dbuser"];
    $password =$_SERVER["dbuserpassword"];
    try{
        
        
    }catch(PDOException $e){
        echo "Connection failed: ".$e->getMessage();
    }
?>