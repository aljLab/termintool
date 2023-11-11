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
            if(getTermineByName(k).length==0){
                terminBox.innerHTML="Keine Termine gebucht.";
            }else{
                terminBox.innerHTML=formatTermine(getTermineByName(k));
            }
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
    let str = '<strong style="text-decoration:underline;">Gebuchte Termine:</strong><br>';
    terminArray.forEach(t=>{
        str = str+ `<strong>${t.date}, ${t.hourValue}:${t.minuteValue} Uhr</strong><br> ${t.leistung.name} (${t.leistung.preis}) <br>`;
    })
    return str;
}
function noDuplicates(kundenString){//entfernt Duplikate aus dem Kunden-Array
    let kids = t.children;
    for(i = 0; i<kids.length; i++){
        if(kids.item(i).id==kundenString){
            return false;       
        }
    }
    return true;
}

