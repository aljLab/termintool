function fetchTermine(callback){
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
}

function fetchKunden(){
    fetch('server-side-php/kunden_handle.php')
    .then(response =>{
        if(!response.ok){
            throw new Error("Network response was not okay.");
        }else{
            return response.json();
        }
    })
    .then(data =>{
        const k=data.map(item => JSON.parse(item));
        k.forEach(e=>{
            kunden.push(e);
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
function insertTermin(termin){//Takes Termin-Objekt als Input und stellt POST-REQUest an entsprechendes server-side php-Skript
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
    .catch(function(error) {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
}
function fetchTermine(){
    console.log(`Termine: ${termine}`);
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
        console.log(`Termine: ${termine}`);
    })
    .catch(error=>{
        console.error('Fetch error', error);
    });
}