<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    // Include the PHPMailer autoloader
    require 'phpmailer/src/Exception.php';
    require 'phpmailer/src/PHPMailer.php';
    require 'phpmailer/src/SMTP.php';
    
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    //read POST-Request Body -> Terminobjekt
    $objectArray = json_decode(file_get_contents("php://input"), true);//json_decode('{"hourValue":"09","minuteValue":"30","date":"12.10.2023","leistung":{"name":"Anamnese","dauer":"4","preis":"60"},"kunde":{"anrede":"Dr.","vorname":"Aljoscha","nachname":"Lustig","mail":"aljoschalabonte@rocketmail.com","phone":"017623559949"}}');

    $lei = $objectArray->leistung;
    $kun = $objectArray->kunde;
    $nameString = "$kun->anrede $kun->nachname";
    $tString = "$objectArray->date, $objectArray->hourValue : $objectArray->minuteValue Uhr";
    
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
        $mail->addAddress($kun->mail, $kun->anrede." ".$kun->vorname." ".$kun->nachname);

        // Content
        $mail->isHTML(true);
        $mail->CharSet = "UTF-8";
        $mail->Subject = "Terminbestätigung $tString";
        $mail->Body = nl2br("Terminbestätigung\n
                Sehr geehrte/r $nameString, \n
                Hiermit bestätige ich den gebuchten Termin am $tString.
                Gebucht wurde Leistung: $lei->name ($lei->preis €).

                Bitte antworten Sie nicht auf diese Mail. \n
                Stornierung und Fragen bitte an skymove@posteo.de.
            ");

        // Send the email
        $mail->send();
        echo 'Email sent successfully';
    } catch (Exception $e) {
        echo "Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
