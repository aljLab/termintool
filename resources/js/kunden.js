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

        kundenDeleteButton.innerHTML="<img width='80px' height='80px' src='resources/images/cross.png'>";
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


/*function makeKundenModBox(kunde){
    console.log(kunde);
    let div = document.createElement("div");
    div.setAttribute("class", "modBox");
    //make dropdown-container within kundenmodbox (will be positioned relatively)
    let dropDown = document.createElement("div");
    dropDown.classList.add("dropDown");
    //create div for content, fetch content, append content
    let dropDownContent = document.createElement("div");
    dropDownContent.id=JSON.stringify(kunde)+"termine";
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
    but1.addEventListener("click", (e)=>{
        let con = document.getElementById(e.target.id+"termine");
        con.classList.toggle("termineButtonClicked", true);
    })
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
}*/
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
        str = str+ `${t.date}, ${t.hourValue}:${t.minuteValue} Uhr, ${t.leistung} <br>`;
    })
    return str;
}

