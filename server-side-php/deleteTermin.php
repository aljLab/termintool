<?php
$dns = "mysql:host=localhost;dbname=termintool";
$user = $_SERVER["dbuser"];
$password = $_SERVER["dbuserpassword"];
$t = file_get_contents("php://input"); // Reading POST-Request body from Fetch-Request

try {
    $conn = new PDO($dns, $user, $password);
    $conn->beginTransaction();
    $sql = "DELETE FROM termine WHERE kunden IS NULL";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bindParam(1, $t, PDO::PARAM_STR);
        $stmt->execute();
        $conn->commit();
        echo "Data deleted successfully. $t";
    } else {
        echo "Error: " . $conn->errorInfo()[2];
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>