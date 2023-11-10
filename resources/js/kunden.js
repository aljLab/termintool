var t = document.getElementById("kundenContainer");

function fillKundenTabelle(){
    if(window.innerWidth>767){
        kunden.forEach(k=>{
            let row = document.createElement("div");
            row.setAttribute("class", "kundeContainer");
            for(let prop in k){
                let col = document.createElement("div");
                if(prop === "termine"){
                    if(k.termine==""){
                        col.innerHTML="Keine Termine";
                    }else{
                        col.innerHTML=`${termine.length} Termine`;
                    }
                }else{
                    col.innerHTML=`${k[prop]}`;
                }
                col.setAttribute("class", "infoBubble");
                row.appendChild(col);        
            }
            let kundenModBox = makeKundenModBox(k);
            row.appendChild(kundenModBox);
            t.appendChild(row);
        })
    }else{//Mobile adaptions
        adaptSideBar();
        kunden.forEach(k=>{
            let row = document.createElement("div");
            row.setAttribute("class", "kundeContainer");
            let i = 0;
            let subRow = document.createElement("div");
            for(let prop in k){
                if(i==0){
                    subRow=document.createElement("div");
                    subRow.setAttribute("class", "subRow");
                }else{
                    subRow=subRow;
                }
                let col = document.createElement("div");
                console.log(prop === "termine");
                if(prop === "termine"){
                    if(k.termine==""){
                        col.innerHTML="Keine Termine";
                    }else{
                        col.innerHTML=`${termine.length} Termine`;
                    }
                }else{
                    col.innerHTML=`${k[prop]}`;
                }
                col.setAttribute("class", "infoBubble");
                subRow.appendChild(col);  
                if(i==2){
                    row.appendChild(subRow);
                }
                i=(i+1)%3;  
            }
            let kundenModBox = makeKundenModBox(k);
            row.appendChild(kundenModBox);
            t.appendChild(row);
        })
    }
}

function makeKundenModBox(kunde){
    console.log(`Kundenarray: ${kunden}`);
    console.log(kunde);
    let div = document.createElement("div");
    div.setAttribute("class", "modBox");
    //make dropdown-container within kundenmodbox (will be positioned relatively)
    let dropDown = document.createElement("div");
    dropDown.classList.add("dropDown");
    //create div for content, fetch content, append content
    let dropDownContent = document.createElement("div");
    let arr = getTermineByName(kunde);
    if(arr.length==0){
        dropDownContent.innerHTML= "Keine Termine gebucht.";
    }else{
        dropDownContent.innerHTML=formatTermine(arr);
    }
    
    dropDownContent.classList.add('dropDownContent');
    dropDown.appendChild(dropDownContent);

    //ID der modBox ist der JSON-String des
    div.id=JSON.stringify(kunde);
    //Buttons: button 1 is within dropdown and triggers showing of dropdowncontent on hover
    let but1=document.createElement("button");
    let but2=document.createElement("button");
    dropDown.appendChild(but1);

    //delete-functionality on delete-Button
    but2.addEventListener("click", (e)=>{
        console.log(e.target.parentNode.id);
        deleteKunde(e.target.parentNode.id, ()=>{
            setTimeout(() => {
               window.location.reload();
            }, 500); // Delay in milliseconds
        });
    });
    but1.innerHTML="Termine einsehen";
    but2.innerHTML="Kunden entfernen";
    div.appendChild(dropDown);
    div.appendChild(but2);
    return div;
}
function getTermineByName(kunde){
    let terminArray=[];
    termine.forEach(t=>{
        if(JSON.stringify(t.kunde) === JSON.stringify(kunde)){
            terminArray.push(t);
        } 
    })
    return terminArray;
}
function formatTermine(terminArray){
    let str = 'Gebuchte Termine:<br>';
    terminArray.forEach(t=>{
        str = str+ `${t.date}, ${t.hourValue}:${t.minuteValue} Uhr [${t.leistung}, ${t.dauer*15} min] <br>`;
    })
    return str;
}
