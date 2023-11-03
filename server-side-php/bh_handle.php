<?php
$dns ="mysql:host=localhost;dbname=termintool";
$user = $_SERVER["dbuser"];
$password =$_SERVER["dbuserpassword"];
try {
    // Select data from MySQL table (modify the query as needed)
    $conn = new PDO($dns, $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "SELECT bh FROM businesshours";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);//contains associative Array, where the json-strings are the values 
        header('Content-Type: application/json'); // Set the response header
        echo json_encode($data);//echos array of json-objects of this structure: {termin:JSON_STRING}
    } else {
        error_log( "Error: " . $conn->errorInfo()[2]);
    }
} catch (PDOException $e) {
    error_log($e->getMessage());
    error_log("Error: " . $e->getMessage());
}
?>