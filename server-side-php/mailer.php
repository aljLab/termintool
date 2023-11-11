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
    $t = file_get_contents("php://input");//'{"hourValue":"09","minuteValue":"30","date":"12.10.2023","leistung":{"name":"Anamnese","dauer":"4","preis":"60"},"kunde":{"anrede":"Dr.","vorname":"Aljoscha","nachname":"Lustig","mail":"aljoschalabonte@rocketmail.com","phone":"017623559949"}}';
    $objectArray = json_decode($t, true);
    $lei = $objectArray['leistung'];
    $kun = $objectArray['kunde'];
    $nameString = $kun['anrede'] . ' ' . $kun['nachname'];
    $tString = $objectArray['date'] . ', ' . $objectArray['hourValue'] . ':' . $objectArray['minuteValue'] . ' Uhr (' . $lei['name'] . ')';
    $leiNa=$lei['name'];
    $leiPreis=$lei['preis'];

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
        $mail->Sender('naturheilpraxis.labonte@gmail.com');
        // Add a recipient
        $mail->addAddress($kun["mail"], $kun["anrede"]." ".$kun["vorname"]." ".$kun["nachname"]);

        // Content
        $mail->isHTML(true);
        $mail->CharSet = "UTF-8";
        $mail->Subject = "Terminbestätigung $tString";
        $mail->Body = nl2br("Terminbestätigung\n
                Sehr geehrte/r $nameString, \n\n
                Hiermit bestätige ich Ihnen den gebuchten Termin:\n
                $tString.\n
                Gebucht wurde Leistung: $leiNa ($leiPreis €).

                Informationen und weitere Angebote finden sie auf https://martinalabonte.de

                Dies ist eine automatisierte Nachricht, bitte antworten sie nicht auf diese Mail.\n
                Im Falle weiterer Fragen oder sollten Sie den Termin stornieren wollen, wenden Sie sich bitte an skymove@posteo.de.\n
                Telefonisch erreichen Sie mich unter: (0341) 3034 384.\n

                Wird ein Termin nicht wahrgenommen und nicht mindestens 24 Stunden vor Terminbeginn abgesagt, behalte ich mir vor, eine Ausfallgebühr von 50€ zu berechnen.
            ");

        // Send the email
        $mail->send();
        echo 'Email sent successfully';
    } catch (Exception $e) {
        echo "Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
}