<?php
$dns = "mysql:host=localhost;dbname=termintool";
$user = $_SERVER["dbuser"];
$password = $_SERVER["dbuserpassword"];
$bh = file_get_contents("php://input"); // Reading POST-Request body from Fetch-Request

try {
    $conn = new PDO($dns, $user, $password);

    $sql0 = "DELETE FROM businesshours";
    $deleteStmt = $conn->prepare($sql0);

    if ($deleteStmt) {
        $deleteStmt->execute();
    } else {
        echo "Error deleting data: " . $conn->errorInfo()[2];
    }

    $sql = "INSERT INTO businesshours (bh) VALUES (?)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bindParam(1, $bh, PDO::PARAM_STR);
        $stmt->execute();
        echo "Data inserted successfully. $bh";
    } else {
        echo "Error: " . $conn->errorInfo()[2];
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>