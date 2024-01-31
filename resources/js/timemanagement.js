const table = document.getElementById("timeTable");
const timeRegEx="([0-2]?[0-9]\.[0-5][0-9])";
//business hours werden in db gespeichert: spalten=timeSlots, zeilen=weekdays?

async function setUpTimeManagement(){//called onload of body, 
    await fetchKunden();
    await fetchTermine();
    await fetchFerienZeiten();
    await fetchBusinessHours();
    setUpTimeTable();
    setUpFerienZeiten();
    setUpBlockTermin();
}

function setUpTimeTable(){//sets up time Table for Business hours
    if(window.innerWidth<=767){
        adaptSideBar();
    }
    var dayNames=["mo","di","mi","don","fr"];//watch out for the don...
    dayNames.forEach(e => {
        let tr = document.getElementById(`t${e}`);
        tr.innerHTML=`<td>${e.charAt(0).toUpperCase()}${e.charAt(1)}</td>`;
        let dayArray = sortDayArray(bh[e]);
        let i = 0;
            dayArray.forEach(timeslot=>{
                let start = timeslot.split("-")[0];
                let schluss = timeslot.split("-")[1];
                let td = document.createElement("td");
                let in1=document.createElement("input");
                let in2=document.createElement("input");
                in1.value=start;
                in1.size="5";
                in2.value=schluss;
                in2.size="5";
                in1.setAttribute("class", "tableInput");
                in2.setAttribute("class", "tableInput");
                in1.setAttribute("id", `${e}start${i}`);//eg. mostart0 für ersten Input in erster inputzelle in montag row (id="tmo")
                in2.setAttribute("id", `${e}schluss${i}`);
                in1.setAttribute("pattern", timeRegEx);
                in2.setAttribute("pattern", timeRegEx);
                in1.addEventListener("blur", function(e){//EventListener to change submitbutton if input is invalid
                        changeSubmitButtonAppearance(e, document.getElementById("updateBusinessHours"));
                });
                in2.addEventListener("blur", function(e){
                    changeSubmitButtonAppearance(e, document.getElementById("updateBusinessHours"));
                });
                td.appendChild(in1);
                td.appendChild(in2);
                tr.appendChild(td);
                i++;
            })
    });
}
function setUpBlockTermin(){
    let a = document.getElementById("reserveDay");
    let b = document.getElementById("reserveMonth");
    let c = document.getElementById("reserveYear");
    let d = document.getElementById("startTime");
    let e = document.getElementById("endTime");
    let but = document.getElementById("blockDateSubmit");
    //Setting up Submission action in Termine blockieren!
    var sb = document.getElementById("blockDateSubmit");//get submitbutton
    sb.addEventListener("click", checkTermin);

    a.addEventListener("blur", function(e){
        changeSubmitButtonAppearance1(e, but);
    });
    b.addEventListener("blur", function(e){
        changeSubmitButtonAppearance1(e, but);
    });
    c.addEventListener("blur", function(e){
        changeSubmitButtonAppearance1(e, but);
    });
    d.addEventListener("blur", function(e){
        changeSubmitButtonAppearance1(e, but);
    });
    e.addEventListener("blur", function(e){
        changeSubmitButtonAppearance1(e, but);
    });
}
function setUpFerienZeiten(){
    let fbut= document.getElementById("submit-button-fz");
    fbut.addEventListener("click",()=>{
        let s = document.getElementById("ferien-zeit-start-datum");
        let end = document.getElementById("ferien-zeit-end-datum");
        let fz = new FerienZeit(s.value, end.value);
        setFerienZeiten(fz);
    });
    fillFzDisplay();
}
function fillFzDisplay(){
    let c = document.getElementById("ferien-zeiten-display");
    ferienZeiten.forEach(fz=>{
        let div = document.createElement("div");
        div.classList.add("ferien-zeit-div");
        div.id=JSON.stringify(fz);
        let delButton = document.createElement("button");
        delButton.classList.add ("fz-delete-button");
        delButton.id=JSON.stringify(fz);
        delButton.innerHTML="X";
        delButton.addEventListener("click", (e)=>{
            deleteFz(e.target.parentNode.id, ()=>{
                    setTimeout(() => {
                    window.location.reload();
                    }, 500); // Delay in milliseconds
                });
        });
        let dis = document.createElement("div");
        dis.innerHTML =`${fz.d1} - ${fz.d2}`;
        div.style.display="flex";
        div.appendChild(dis);
        div.appendChild(delButton);
        c.appendChild(div);
    })
}

function checkTermin(){
    //make Termin
    let message;
    let t = getBlockedTermin();//returns Termin Object which is supposed to be blocked
    console.log(t);
    let fb = document.getElementById("feedbackBlockTermin");
    if (typeof t !=="object"){
        message = "Eingabefelder sind leer.";
    }else{
        message = provideTerminFeedback(t);
    }
    fb.innerHTML = message;
}
function getBlockedTermin(){//returns new Termin mit den Eingabewerten der Inputs der Termin-Reservierungsform
    var f = document.getElementById("makeReservationForm");
    let d = Number(f.elements.day.value);
    let m = Number(f.elements.month.value);
    let y=f.elements.year.value;
    let start=f.elements.startTime.value;
    let end=f.elements.endTime.value;
    let dauer = (Number(end.split(".")[0])-Number(start.split(".")[0]))*4+(Number(end.split(".")[1])-Number(start.split(".")[1]))/15;
    
    if(d!==""&&m!==""&&y!==""&&start!==""&&end!==""){
        return new Termin(start.split(".")[0], start.split(".")[1], `${d}.${m}.${y}`, new Leistung("BLOCKED", dauer, "--"),dauer, new Kunde("","IT","ADMIN", "praxisbuero@posteo.de", "XXXXXXXXXXXX"));
    }else{
        return -1;
    }
}
function provideTerminFeedback(termin){
    let fb="";
    let d = termin.date.split(".")[0];
    let m = termin.date.split(".")[1];
    let y = termin.date.split(".")[2];
    console.log("termin which is tested: \n");
    console.log(termin);
    if(pastToday(new Date(y, m-1, d))){
        //if(withinBusinessHours(termin, bh)){
            if(noTerminConflicts(termin)){
                if(termin.dauer>0){
                    //safeToDB
                    saveTerminToDB(termin);
                    fb = "Termin erfolgreich blockiert.";
                }else{
                    fb="Endzeit kann nicht vor der Startzeit liegen.";
                }
            }else{
                fb="Termin wurde schon gebucht oder überschneidet sich mit einem bereits gebuchten Termin.";
            }
       // }else{
           // fb="Termin liegt außerhalb der Geschäftszeiten.";
       // }
    }else{
        fb="Termin liegt in der Vergangenheit.";
    }
    return fb;
}
function pastToday(date){
    let today = new Date();
    return date.getTime()>today.getTime();
}
function saveTerminToDB(termin){
    insertTermin(termin);
}
function changeSubmitButtonAppearance(e, but){//Function für EventListener ("blur") für Inputs: wenn ein Input invalid verlassen wird, ändert sich submitbutton
        if(!e.currentTarget.validity.valid||!correctOrder(e.target)){
            but.style.backgroundColor="rgb(0,0,0,0.2)";
            but.style.border="2px solid black";
            but.style.pointerEvents="none";
            e.target.parentElement.style.backgroundColor="#d46c6c";
        }else{
            but.style.backgroundColor="white";
            but.style.pointerEvents="all";
            but.style.border="0px";
            but.style.cursor="pointer";
            e.target.parentElement.style.backgroundColor="var(--lightest-color)";
        }
}
function changeSubmitButtonAppearance1(e, but){//Function für EventListener ("blur") für Inputs: wenn ein Input invalid verlassen wird, ändert sich submitbutton
    if(!e.currentTarget.validity.valid){
        but.style.backgroundColor="rgb(0,0,0,0.2)";
        but.style.border="2px solid black";
        but.style.pointerEvents="none";
    }else{
        but.style.backgroundColor="white";
        but.style.pointerEvents="all";
        but.style.border="0px";
        but.style.cursor="pointer";
    }
}
function noOverlaps(bho){
    for(let prop in bho){
        let compArray=[];
        sortDayArray(bho[prop]).forEach(timeslot =>{
            if(timeslot !== "-"){
                compArray.push(timeslot.split("-")[0]);
                compArray.push(timeslot.split("-")[1]);
            }
        })
        for(i =0;i<compArray.length;i++){
            if(i!=compArray.length-1&&Number(compArray[i])>Number(compArray[i+1])){
                return false;
            }
        }
    }
    return true;
}
function sortDayArray(a){//sorts input like ["15.00-16.00", "14.00-15.00","-"] ----> ["14.00-15.00", "15.00-16.00", "-"]
    let arr = a;
    for(i=1;i<arr.length-1;i++){//<length-1 weil letztes Element "-" ist
        let j = i;
        while(j!=0&&Number(arr[j].split("-")[0]<Number(arr[j-1].split("-")[0]))){
            let temp = arr[j];
            arr[j]=arr[j-1];
            arr[j-1]=temp;
            j--;
        }
   }
   return arr;
}
function updateBusinessHours(){//erstellt und speichert neues BusinessHours-Object mit den eingegebenen Werten und passt Layout an
    var dayNames=["mo","di","mi","don","fr"];
    let fb=document.getElementById("feedbackBusinessHours");
    let copy = {
        "mo":bh["mo"],
        "di":bh["di"],
        "mi":bh["mi"],
        "don":bh["don"],
        "fr":bh["fr"]
    };
    dayNames.forEach(dayName=>{
        for(i=0; i<copy[dayName].length;i++){
            let in1=document.getElementById(`${dayName}start${i}`);//id z.B. mostart0
            let in2=document.getElementById(`${dayName}schluss${i}`);//id z.B. moschluss0
            console.log(`${in1}, ${in2}`);
            copy[dayName][i]=`${in1.value}-${in2.value}`;//Input an Stelle im Array (über)schreiben; Format: "HH.MM-HH.MM"
        }
        copy[dayName]=copy[dayName].filter(function(str){//entfernen von "-"
            return str!== "-";
        })
        if(copy[dayName][i-1]!=="-"){
            copy[dayName].push("-");
        }
    })
    if(noOverlaps(copy)){
         //Safe to Database!!!!
        for(let prop in bh){
            bh[prop]=copy[prop];
        }
        setBusinessHours(copy);
        setUpTimeTable();
        fb.innerHTML="* Geschäftszeiten erfolgreich aktualisiert.";
        fb.style.display="block";
        fb.style.backgroundColor="var(--lightest-color)";
    }else{
        fb.innerHTML="* Zeiträume dürfen sich innerhalb eines Tages nicht überschneiden";
        fb.style.display="block";
        fb.style.backgroundColor="#d46c6c";
    }
}
function correctOrder(inp){//expects 1 inputs
    //gets the corresponding input
    let in1, in2;
    if(inp.id.match(new RegExp("start"))!=null){
        in1=inp;
        in2=document.getElementById(in1.id.replace(new RegExp("start"), "schluss"));
    }else{
        in2=inp;
        in1=document.getElementById(in2.id.replace(new RegExp("schluss"), "start"));
    }
    console.log(`In1.value ist ${in1.value}, In2 ist ${in2.value}`);
    if(in1.value===in2.value){
        return true;
    }else
    return Number(in1.value)<Number(in2.value);

}


/*----------------------------------------------------------Testing------------------------------------------------------ */
function testBlockTermin(){
    //getBlockedTermin()
    //Termin in Vergangenheit
    if(pastToday(new Date(new Date().getTime()-450000))){
        console.log(`Error: pastToday() true für vergangenes Datum, FAIL`);
    }else{
        console.log(`pastToday() liefert false für vergangenes Datum, PASS`);
    }
    //Termin außerhalb der BH
    testWithinBH();
    //Termin innerhalb BH und Terminkonflikt, 29.10. 11.30Uhr;
    if(noTerminConflicts(new Termin("11", "00", "29.9.2023", "Yoga/Atemsitzung", 4), termine)){
        console.log(`Error: Test case failed. noTerminConflicts(taken termin) liefert TRUE, FAIL`);
    }else{
        console.log("Testcase passed: besetzter Termin richtig als falsch erkannt, PASS");
    }
    //
}
function testWithinBH(){
    //out of bh
    withinBusinessHours(new Termin("6", "30", "5.10.2023", "Yoga/Atemsitzung", 4))===false? console.log(`Test case outside of bh PASS.`):
        console.log(`test case FAIL: Termin is outside of bh!!!`);
    //within bh
    withinBusinessHours(new Termin("10", "30", "5.10.2023", "Yoga/Atemsitzung", 4))=== true?console.log(`Test case inside of bh PASS.`):
    console.log(`test case FAIL: Termin is inside of bh!!!`);
    //halb in bh
    withinBusinessHours(new Termin("9", "00", "5.10.2023", "Yoga/Atemsitzung", 4))=== false?console.log(`Test case halb in bh PASS.`):
    console.log(`test case FAIL: Termin is NOT fully inside of bh!!!`);
}
function testBusinessHours(){

}