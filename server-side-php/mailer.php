<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    // Include the PHPMailer autoloader
    require 'phpmailer/src/Exception.php';
    require 'phpmailer/src/PHPMailer.php';
    require 'phpmailer/src/SMTP.php';

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'naturheilpraxis.labonte@gmail.com';
        $mail->Password = getEnv('apppw');
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;

        // Set the From address
        $mail->setFrom('naturheilpraxis.labonte@gmail.com', 'Martina La Bonté');

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
