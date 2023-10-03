<?php
    /*$data =[
        '{"hourValue":"09","minuteValue":"30","date":"19.9.2023","leistung":"Anamnese", "dauer":4}',
        '{"hourValue":"11","minuteValue":"30","date":"29.9.2023","leistung":"Anamnese", "dauer":4}',
        '{"hourValue":"15","minuteValue":"00","date":"5.10.2023","leistung":"Anamnese", "dauer":4}'
    ];//to be replaced by database <request>*/
    require_once("conn.php");

    try {
        // Insert data into MySQL table (modify the query as needed)
        $sql = "SELECT (termin) FROM termine";
        $stmt = $conn->prepare($sql);
    
        if ($stmt) {
            $data=$stmt->execute($t);
            echo "Data fetched successfully.";
        } else {
            echo "Error: " . $conn->errorInfo()[2];
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
    header('Content-Type:application/json');//set header
    echo json_encode($data);//echo the required data as json-objects back to the browser
