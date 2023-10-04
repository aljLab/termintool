const tc = document.getElementById("terminContainer");

function displayTermine(){
    tc.innerHTML="<button onclick = 'sortAsc()'>Sortieren</button>";
    termine.forEach(t=>{
        let div = document.createElement("div");
        let ter = document.createElement("div");
        let kun = document.createElement("div");
        ter.innerHTML=`<h2>Termin</h2><p>${t.date}</p><p>${t.hourValue}.${t.minuteValue}</p><p>${t.leistung}</p><p>${(t.dauer-1)*15} min</p>`;
        kun.innerHTML=`<h2>Kunde</h2><p>${t.kunde.anrede} ${t.kunde.vorname} ${t.kunde.nachname}</p><a mailto="${t.kunde.mail}">${t.kunde.mail}</a><p>${t.kunde.phone}</p>`;
        let modBox= makeModBox();
        div.classList.add("terminkunde");
        ter.classList.add("terminDisplay");
        kun.classList.add("kundenDisplay");

        div.appendChild(ter);
        div.appendChild(kun);
        div.appendChild(modBox);
        tc.appendChild(div);
    })
}
function makeModBox(){
    let div = document.createElement("div");
    let but1= document.createElement("button");
    let but2=document.createElement("button");
    but1.innerHTML="Termin stornieren";
    but2.innerHTML="Kunden anzeigen";
    but1.addEventListener("click", (e)=>{
        e.target.style.display = "none";
    });
    but2.onclick="showKunde()";
    div.classList.add("modBox");
    div.appendChild(but1);
    div.appendChild(but2);
    return div;
}
function handleStorno(){

}
function sortAsc(){
    termineCopy = termine;
    termine = [];
    console.log(termine);
    termineCopy.forEach(t=>{
        orderInAsc(t);
        console.log(termine);
    });
    displayTermine();
}

function orderInAsc(termin){//sortiert 'termine' nach Zeitpunkt (aufsteigend)
    let compDate= getCompDate(termin);
    if(termine.length){//Falls Länge von Termine größer als 0
        for(i=termine.length-1; i>=0;i--){
            if(getCompDate(termine[i])<compDate){
                if(i==termine.length-1){
                    termine.push(termin);
                    console.log("Termin pushed.");
                    return;
                }else{
                    termine.splice(i+1, 0, termin);
                    console.log("Termin inserted.");
                    return;
                }
            }else if(i ==0){
                termine.splice(0, 0, termin);
                console.log("Termin inserted.");
                return;
            }
        }
    }else{
        termine.push(termin);
        console.log("Termin pushed.");
    }
}
function getCompDate(termin){
    return new Date(termin.date.split(".")[2], termin.date.split(".")[1]-1, termin.date.split(".")[0], termin.hourValue, termin.minuteValue);
}