const tc = document.getElementById("terminContainer");

function displayTermine(){
    if(window.innerWidth<=767){
        adaptSideBar();
    }
    tc.innerHTML="";
    let fb = document.createElement("span");
    fb.id="termineFeedback";
    tc.appendChild(fb);
    termine.forEach(t=>{
        let div = document.createElement("div");
        let ter = document.createElement("div");
        let kun = document.createElement("div");
        ter.innerHTML=`<h2>Termin</h2><p>${t.date}</p><p>${t.hourValue}.${t.minuteValue} Uhr</p><p>${t.leistung}</p><p>${(t.dauer)*15} min</p>`;
        kun.innerHTML=`<h2>Kunde</h2><p>${t.kunde.anrede} ${t.kunde.vorname} ${t.kunde.nachname}</p><a mailto="${t.kunde.mail}">${t.kunde.mail}</a><p>${t.kunde.phone}</p>`;
        let modBox= makeModBox(t);
        
        if(getCompDate(t)>(new Date().getTime())){
            div.classList.add("terminkunde");
            ter.classList.add("terminDisplay");
            kun.classList.add("kundenDisplay");
        }else{
            div.classList.add("terminkundePASSED");
            ter.classList.add("terminDisplayPASSED");
            kun.classList.add("kundenDisplayPASSED");
        }

        div.appendChild(ter);
        div.appendChild(kun);
        div.appendChild(modBox);
        
        tc.appendChild(div);
    })
}
function makeModBox(termin){
    let div = document.createElement("div");
    let but3=document.createElement("button");
    but3.innerHTML="Termin aus Database löschen";
    but3.classList.add("kundenDeleteButton");
    but3.addEventListener("click", ()=>{
        console.log(termin);
        setUpTerminModal(termin);
    });
    div.classList.add("modBox");
    div.appendChild(but3);
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

function orderInAsc(termin){//sortiert Input termin in 'termine'-Array nach Zeitpunkt (aufsteigend) ein
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

function setUpTerminModal(termin){
    window.scrollTo(0,0);
    let m = document.getElementById("terminModal");
    let mb = document.getElementById("terminModalBack");
    let cb = document.getElementById("termineCloseButton");
    let dl = document.getElementById("termineDeleteButton");
    let bod = document.body;
    let mess= document.createElement("span");
    /*mess.innerHTML=`Termin am ${termin.date} um ${termin.hourValue}.${termin.minuteValue} Uhr wird dauerhaft gelöscht.`;
    bod.insertBefore(mess, dl);*/
    dl.addEventListener("click", ()=>{
        console.log(termin);
        closeTerminModal();
        deleteTermin(termin, ()=>{
            setTimeout(() => {
               window.location.reload();
            }, 500); // Delay in milliseconds
        });
    });
    cb.addEventListener("click", closeTerminModal);
    m.style.display="flex";
    mb.style.display="block";
}

//Modal handling, Usability adding
function closeTerminModal(){
    let m = document.getElementById("terminModal");
    let mb = document.getElementById("terminModalBack");

    m.style.display="none";
    mb.style.display="none";
}