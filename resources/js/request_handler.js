/*function fetchTermine(callback){
    fetch('./server-side-php/termin_handle.php')
    .then(response =>{
        if(!response.ok){
            throw new Error("Network response was not okay.");
        }else{
            return response.json();
        }
    })
    .then(data =>{
        const t=data.map(item => JSON.parse(item));
        t.forEach(termin =>{
            termine.push(termin);
        })
        console.log("everything has been pushed");
        callback();
    })
    .catch(error=>{
        console.error('Fetch error', error);
    });
}*/
function fetchTermine() {
    return fetch('./server-side-php/termin_handle.php')
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not okay.");
            } else {
                return response.json();
            }
        })
        .then(data => {
            // No need to parse JSON again, as it's already parsed {termin: JSON-String}
            data.forEach(obj=>{
                orderInAsc(JSON.parse(obj.termin));
            })
            //callback();
        })
        .catch(error => {
            console.error('Fetch error', error);
        });
}
function fetchKunden(){
    return fetch('./server-side-php/kunden_handle.php')
    .then(response =>{
        if(!response.ok){
            throw new Error("Network response was not okay.");
        }else{
            return response.json();
        }
    })
    .then(data =>{
        data.forEach(e=>{
            kunden.push(JSON.parse(e.kunde));
        })
        //callback();
    })
    .catch(error=>{
        console.error('Fetch error', error);
    });
}
function fetchLeistungen(){

}
function fetchBusinessHours(){
    return fetch('./server-side-php/bh_handle.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not okay.");
                } else {
                    return response.json();
                }
            })
            .then(data => {
                //{bh: JSON-String}
                data.forEach(obj=>{
                    bh = JSON.parse(obj.bh);
                })
                //callback();
            })
            .catch(error => {
                console.error('Fetch error', error);
            });
}
function fetchFerienZeiten(){
    return fetch('./server-side-php/fz_handle.php')
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not okay.");
            } else {
                return response.json();
            }
        })
        .then(data => {
            //{fz: JSON-String}
            data.forEach(obj=>{
                ferienZeiten.push(JSON.parse(obj.fz));
            })
            //callback();
        })
        .catch(error => {
            console.error('Fetch error', error);
        });
}

/*----------------------------pushing-------------------------------*/
function insertTermin(termin){//Takes Termin-Objekt als Input und stellt POST-Request an entsprechendes server-side php-Skript
    fetch("./server-side-php/settingTermine.php",{
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(termin),
        }
    ).then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(function(responsetext) {
        // Handle the response from the server
        console.log(responsetext);
    })
    .catch(function(error){
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
}

function deleteTermin(termin, cb){//Takes Termin-Objekt als Input und stellt POST-Request an entsprechendes server-side php-Skript
    fetch("./server-side-php/deleteTermin.php",{
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(termin),
        }
    ).then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        cb(displayTermine);
        return response.text();
    })
    .then(function(responsetext) {
        // Handle the response from the server
        console.log(responsetext);
    })
    .catch(function(error){
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
}

function checkFetching(){
    insertTermin(new Termin("15", "30", "24.10.2023","Telefontermin", 2, new Kunde("Frau", "Doris", "Piesler", "example@beta.com", "0176223987239", [])));
}
function insertKunde(kunde){//Takes Kunden-Objekt als Input und stellt POST-Request an entsprechendes server-side php-Skript
    fetch("./server-side-php/settingKunde.php",{
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(kunde),
        }
    ).then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(function(responsetext) {
        // Handle the response from the server
        console.log(responsetext);
    })
    .catch(function(error){
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
}
function deleteKunde(kundenString, cb){
    fetch("./server-side-php/deleteKunde.php",{
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            body: kundenString,
        }
    ).then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        cb(displayTermine);
        return response.text();
    })
    .then(function(responsetext) {
        // Handle the response from the server
        console.log(responsetext);
    })
    .catch(function(error){
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
}
function sendMail(termin){
    fetch("./server-side-php/mailer.php", {
        method:"POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(termin),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not okay.");
        } else {
            console.log(response);
        }
    })
    .catch(error => {
        console.error('Fetch error', error);
    });
}
function sendMailNotification(termin){
    fetch("./server-side-php/mail_notification.php", {
        method:"POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(termin),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not okay.");
        } else {
            console.log(response);
        }
    })
    .catch(error => {
        console.error('Fetch error', error);
    });
}
function setBusinessHours(bh){//Takes Kunden-Objekt als Input und stellt POST-Request an entsprechendes server-side php-Skript
    fetch("./server-side-php/settingBh.php",{
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(bh),
        }
    ).then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(function(responsetext) {
        // Handle the response from the server
        console.log(responsetext);
    })
    .catch(function(error){
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
}
function setFerienZeiten(fzObject){
    fetch("./server-side-php/setFz.php", {
        method: "POST", 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(fzObject),
    })
    .then(function(response){
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(function(responsetext) {
        // Handle the response from the server
        console.log(responsetext);
    })
    .catch(function(error){
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
}
function deleteFz(fzstr){
    console.log(fzstr);
    fetch("./server-side-php/delete_ferienzeit.php", 
    {
        method: "POST", 
        headers: {'Content-Type': 'application/json'},
        body: fzstr,
    })
    .then(function(response){
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(function(responsetext) {
        // Handle the response from the server
        console.log(responsetext);
    })
    .catch(function(error){
        // Handle any errors that occurred during the fetch
        console.error('error: fz not deleted', error);
    });
}


