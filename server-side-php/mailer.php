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
        $mail->XMail = "Termintool - Martina La Bonté";

        // Set the From address
        $mail->setFrom('naturheilpraxis.labonte@gmail.com', 'Martina La Bonté');
        //$mail->setSender('naturheilpraxis.labonte@gmail.com');
        // Add a recipient
        $mail->addAddress($kun["mail"], $kun["anrede"]." ".$kun["vorname"]." ".$kun["nachname"]);

        // Content
        $mail->isHTML(true);
        $mail->CharSet = "UTF-8";
        $mail->Subject = "Terminbestätigung $tString";
        $mail->Body = "
                <div style = 'background-color:white;'>
                    <div style ='background-color:#79c2d0;width:100%;padding:5px;text-align:center'>
                        <strong style='font-size:16px;'>Terminbestätigung</strong><br><br>
                    </div>
                    <p>Sehr geehrte/r <strong>$nameString</strong>,</p>
                    Hiermit bestätige ich Ihnen den gebuchten Termin:<br><br>
                    <div style = 'background-color:#ccf5fb;width:100%; display:flex; align-items:center;justify-content:center;'>
                        <p style = 'font-size:15px; margin: 5px;'>$tString.</p>
                    </div>
                    <p>Gebucht wurde Leistung: <em>$leiNa ($leiPreis)</em>.</p>

                    <p>Informationen und weitere Angebote finden sie auf <a>https://martinalabonte.de</a></p>

                    <p><em>Dies ist eine automatisierte Nachricht, bitte antworten sie nicht auf diese Mail.</em><br>
                    Im Falle weiterer Fragen oder sollten Sie den Termin stornieren wollen, wenden Sie sich bitte an praxisbuero@posteo.de.<br>
                    Telefonisch erreichen Sie mich unter: (0341) 3034 384.<br></p>

                    <p style='color: maroon'>Wird ein Termin nicht wahrgenommen und nicht mindestens 24 Stunden vor Terminbeginn abgesagt, behalte ich mir vor, eine Ausfallgebühr von 50€ zu berechnen.</p>
                </div>
            ";

        // Send the email
        $mail->send();
        echo 'Email sent successfully';
    } catch (Exception $e) {
        echo "Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
}