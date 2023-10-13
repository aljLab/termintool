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
function fetchTermine(callback) {
    console.log(`Termine: ${termine}`);
    fetch('./server-side-php/termin_handle.php')
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
            console.log("Data received and assigned to termine");
            callback();
        })
        .catch(error => {
            console.error('Fetch error', error);
        });
}
function fetchKunden(){
    fetch('./server-side-php/kunden_handle.php')
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
            console.log(JSON.parse(e.kunde));
        })
    })
    .catch(error=>{
        console.error('Fetch error', error);
    });
}
function fetchLeistungen(){

}
function fetchBusinessHours(){

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

function checkFetching(){
    insertTermin(new Termin("15", "30", "24.10.2023","Telefontermin", 2, new Kunde("Frau", "Doris", "Piesler", "example@beta.com", "0176223987239", [])));
}
