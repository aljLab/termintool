var t = document.getElementById("kundenTabelle");

function fillKundenTabelle(){
    console.log(kunden);
    kunden.forEach(k=>{
        let row = document.createElement("tr");
        for(let prop in k){
            let col = document.createElement("td");
            col.innerHTML=`${k[prop]}`;
            row.appendChild(col);        
        }
        t.appendChild(row);
    })
}