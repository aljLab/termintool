<?php
$dns = "mysql:host=localhost;dbname=termintool";
$user = $_SERVER["dbuser"];
$password = $_SERVER["dbuserpassword"];
$t = file_get_contents("php://input"); // Reading POST-Request body from Fetch-Request

try {
    $conn = new PDO($dns, $user, $password);
    $sql = "INSERT INTO ferienzeiten (fz) VALUES (?)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bindParam(1, $t, PDO::PARAM_STR);
        $stmt->execute();
        echo "Data inserted successfully. $t";
    } else {
        echo "Error: " . $conn->errorInfo()[2];
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>