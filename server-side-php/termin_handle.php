<?php
    $data =[
        '{"hourValue":"09","minuteValue":"30","date":"19.9.2023","leistung":"Anamnese", "dauer":4}',
        '{"hourValue":"11","minuteValue":"30","date":"29.9.2023","leistung":"Anamnese", "dauer":4}',
        '{"hourValue":"15","minuteValue":"00","date":"30.9.2023","leistung":"Anamnese", "dauer":4}'
    ];//to be replaced by database request

    header('Content-Type:application/json');//set header
    echo json_encode($data);//echo the required data as json-objects back to the browser
