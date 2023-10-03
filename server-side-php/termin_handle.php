<?php
$dns ="mysql:host=localhost;dbname=termintool";
$user = $_SERVER["dbuser"];
$password =$_SERVER["dbuserpassword"];
try {
    // Select data from MySQL table (modify the query as needed)
    $conn = new PDO($dns, $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "SELECT termin FROM termine";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        console.log( "Error: " . $conn->errorInfo()[2]);
    }
} catch (PDOException $e) {
    console.log($e->getMessage());
    console.log("Error: " . $e->getMessage());
}

header('Content-Type: application/json'); // Set the response header
echo json_encode($data);
?>

