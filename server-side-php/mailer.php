<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    // Include the PHPMailer autoloader
    require 'phpmailer/src/Exception.php';
    require 'phpmailer/src/PHPMailer.php';
    require 'phpmailer/src/SMTP.php';

    //read POST-Request Body -> Terminobjekt
    $objectArray = json_decode(file_get_contents("php://input"), true);

    $lei = json_decode($objectArray->leistung, true);
    $kun = json_decode($objectArray->kunde, true);
    $nameString = "$kun->anrede $kun->nachname";
    $tString = "$objectArray->date, $objectArray->hourValue : $objectArray->minuteValue Uhr";

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
        $mail->setFrom('naturheilpraxis.labonte@gmail.com', 'Martina La Bonte');

        // Add a recipient
        $mail->addAddress($kun->mail, $kun->anrede." ".$kun->vorname." ".$kun->nachname);

        // Content
        $mail->isHTML(true);
        $mail->Subject = "Terminbestätigung $tString";
        $mail->Body = "Terminbestätigung\n
                Sehr geehrte/r $nameString, \n
                Hiermit bestätige ich den gebuchten Termin am $tString.
                Gebucht wurde Leistung: $lei->name ($lei->preis €).

                Bitte antworten Sie nicht auf diese Mail. \n
                Stornierung und Fragen bitte an skymove@posteo.de.
            ";

        // Send the email
        $mail->send();
        echo 'Email sent successfully';
    } catch (Exception $e) {
        echo "Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
