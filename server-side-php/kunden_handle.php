<?php
    $kunden = [
        '{"vorname":"Peter","nachname":"Lustig","mail":"peter-lustig@web.com","phone":"017623559949", "termine":[]}',
        '{"vorname":"Kool","nachname":"Savas","mail":"kool@savvy.com","phone":"017623552334", "termine":[]}',
        '{"vorname":"Paul","nachname":"Fröhlich","mail":"p.fröhli@yahoo.de","phone":"017843559949", "termine":[]}'
    ];

    header("Content-Type:application/json");
    echo json_encode($kunden);