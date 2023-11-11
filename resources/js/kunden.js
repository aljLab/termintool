var t = document.getElementById("kundenContainer");

function fillKundenTabelle(){
    if(window.innerWidth<767){
        adaptSideBar();
    }
    
    fetchTermine(()=>{
    kunden.forEach(k=>{
        if(noDuplicates(JSON.stringify(k))){
            let row = document.createElement("div");
            row.setAttribute("class", "kundeContainer");
            for(let prop in k){
                let col = document.createElement("div");
                col.innerHTML=`${k[prop]}`;
                col.setAttribute("class", "infoBubble");
                row.appendChild(col);        
            }
            row.id=JSON.stringify(k);
            console.log("Row-id: "+row.id);
            let terminBox = document.createElement("div");
            terminBox.innerHTML=formatTermine(getTermineByName(k));
            terminBox.classList.add("terminBox");
            let kundenDeleteButton = document.createElement("button");
            kundenDeleteButton.classList.add("deleteButton");
            kundenDeleteButton.title="Kunden löschen";
            kundenDeleteButton.innerHTML="<img width='60px' src='resources/images/cross.png'>";
            kundenDeleteButton.addEventListener("click", ()=>{
                deleteKunde(row.id, ()=>{
                    console.log(row.id);
                        setTimeout(() => {
                        window.location.reload();
                        }, 500); // Delay in milliseconds
                    });
            });
            row.appendChild(terminBox);
            row.appendChild(kundenDeleteButton);
            t.appendChild(row);
            }
        })
    })
}   

function getTermineByName(kunde){
    let terminArray=[];
    termine.forEach(t=>{
        if(JSON.stringify(t.kunde) === JSON.stringify(kunde)){
            terminArray.push(t);
        } 
    })
    console.log(terminArray);
    return terminArray;
}
function formatTermine(terminArray){
    let str = '<h4>Gebuchte Termine</h4>:<br>';
    terminArray.forEach(t=>{
        str = str+ `${t.date}, ${t.hourValue}:${t.minuteValue} Uhr<br> ${t.leistung.name} (${t.leistung.preis}) <br>`;
    })
    return str;
}
function noDuplicates(kundenString){//entfernt Duplikate aus dem Kunden-Array
    let kids = t.children;
    console.log(kids);
    for(i = 0; i<t.length; i++){
        console.log("id 1:"+kids.item(i).id);
        console.log("id 2:"+kundenString);
        if(kids.item(i).id==kundenString){
            return false;       
        }
    }
    console.log("No dups found");
    return true;
}

