var t = document.getElementById("kundenContainer");

function fillKundenTabelle(){
    if(window.innerWidth<767){
        adaptSideBar();
    }
    fetchTermine(()=>{
    kunden.forEach(k=>{
        let row = document.createElement("div");
        row.setAttribute("class", "kundeContainer");
        for(let prop in k){
            let col = document.createElement("div");
            col.innerHTML=`${k[prop]}`;
            col.setAttribute("class", "infoBubble");
            row.appendChild(col);        
        }

        let terminBox = document.createElement("div");
        terminBox.innerHTML=formatTermine(getTermineByName(k));
        terminBox.classList.add("terminBox");
        let kundenDeleteButton = document.createElement("button");
        kundenDeleteButton.classList.add("deleteButton");
        kundenDeleteButton.title="Kunden löschen";
        kundenDeleteButton.innerHTML="<img width='60px' src='resources/images/cross.png'>";
        kundenDeleteButton.addEventListener("click", (e)=>{
            deleteKunde(e.target.parentNode.id, ()=>{
                    setTimeout(() => {
                       window.location.reload();
                    }, 500); // Delay in milliseconds
                });
        });
        row.appendChild(terminBox);
        row.appendChild(kundenDeleteButton);
        t.appendChild(row);
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
    let str = 'Gebuchte Termine:<br>';
    terminArray.forEach(t=>{
        str = str+ `${t.date}, ${t.hourValue}:${t.minuteValue} Uhr, ${t.leistung.name} (${t.leistung.preis}) <br>`;
    })
    return str;
}
function removeDuplicates(){//entfernt Duplikate aus dem Kunden-Array
    
}

