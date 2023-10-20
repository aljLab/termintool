<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    // Include the PHPMailer autoloader
    require 'vendor/autoload.php';

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // Set the From address
        $mail->setFrom('skymove@posteo.de', 'Martina La Bonté');

        // Add a recipient
        $mail->addAddress('aljoschalabonte@rocketmail.com', 'Aljoscha Labonte');

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Test Subject';
        $mail->Body = 'This is a test email';

        // Send the email
        $mail->send();
        echo 'Email sent successfully';
    } catch (Exception $e) {
        echo "Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
