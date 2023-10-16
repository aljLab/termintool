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
    }else{
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
    let div = document.createElement("div");
    div.setAttribute("class", "modBox");
    div.id=JSON.stringify(kunde);
    let but1=document.createElement("button");
    let but2=document.createElement("button");
    but1.addEventListener("click", ()=>{
        showTermine();
    });
    but2.addEventListener("click", (e)=>{
        deleteKunde(JSON.parse(e.target.id), ()=>{
            setTimeout(() => {
               window.location.reload();
            }, 500); // Delay in milliseconds
        });
    });
    but1.innerHTML="Termine einsehen";
    but2.innerHTML="Kunden entfernen";
    div.appendChild(but1);
    div.appendChild(but2);
    return div;
}
function showTermine(){

}
