<?php
    require_once("conn.php");
    $t = file_get_contents("php://input");//reading POST-Request body from Fetch-Request

  // Assuming the data is sent as JSON, decode it
    $t = json_decode($t, true);
    $sql = "INSERT INTO termine (termin) VALUES ($t)";

    if($db->query($sql)===TRUE){
        echo "Insert successfull.";
    }