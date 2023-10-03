<?php
require_once("conn.php");

try {
    // Select data from MySQL table (modify the query as needed)
    $sql = "SELECT termin FROM termine";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "Data fetched successfully.";
    } else {
        echo "Error: " . $conn->errorInfo()[2];
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

header('Content-Type: application/json'); // Set the response header
echo json_encode($data);
?>

