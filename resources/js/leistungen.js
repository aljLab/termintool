
function fillLeistungsTabelle(){
    var tab = document.getElementById("leistungsTabelle");
    leistungen.forEach(l=>{
        let row = document.createElement("tr");
        for (let prop in l){
            let col = document.createElement("td");
            if(prop ==="dauer"){
                col.innerHTML=`${l[prop]*15} min`;
            }else{
                col.innerHTML=`${l[prop]}`;
            }
            row.appendChild(col);
        }
        /*let col = document.createElement("td");
        col.style.display="flex";
        col.style.justifyContent="right";
        let modButton=document.createElement("button");
        modButton.innerHTML="Bearbeiten";
        modButton.onclick="deliverLeistungsModification()";
        col.appendChild(modButton);
        row.appendChild(col);*/
        tab.appendChild(row);
    })
}