<?php
$dbuser=$_SERVER["dbuser"];
$dbuserpassword =$_SERVER["dbuserpassword"];
$dns = "mysql:host=localhost;dbname=termintool";

try{
    $conn = new PDO($dns, $dbuser, $dbpassword);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = ("SELECT kunde FROM kunden");
    $stmnt = $conn->prepare($sql);

    if($stmnt){
        $stmnt->execute();
        $stmnt = $conn->prepare($sql);
        $data = $stmnt->fetchAll(PDO::FETCH_ASSOC); //[kunde => [JSON-String]]
        header("Content-Type:application/json");
        echo json_encode($data);// echos [{kunde:JSON-STring},{kunde:JSON-STring}, etc.]
    }
}catch(PDOException $e){
    error_log(e->getMessage());
}