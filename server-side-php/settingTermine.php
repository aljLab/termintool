<?php
    $dns ="mysql:host=localhost;dbname=termintool";
    $user = $_SERVER["dbuser"];
    $password =$_SERVER["dbuserpassword"];
    $t = file_get_contents("php://input");//reading POST-Request body from Fetch-Request
    
  // Assuming the data is sent as JSON, decode it
    $t = json_decode($t, true);
    
    try {
        $conn = new PDO($dns, $user, $password);
        // Insert data into MySQL table (modify the query as needed)
        $sql = "INSERT INTO termine (termin) VALUES (?)";
        $stmt = $conn->prepare($sql);
  
        if ($stmt) {
            $stmt->execute($t);
            echo "Data inserted successfully. $t";
        } else {
            echo "Error: " . $conn->errorInfo()[2];
        }
    } catch (PDOException $e) {
      echo "Error: " . $e->getMessage();
  }
