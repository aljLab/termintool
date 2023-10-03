const table = document.getElementById("timeTable");
const timeRegEx="([0-2]?[0-9]\.[0-5][0-9])";
//business hours werden in db gespeichert: spalten=timeSlots, zeilen=weekdays?

function setUpTimeManagement(){//called onload of body, 
    fetchTermine(()=>{
        console.log("termine gefetched.");
        });
    fetchKunden();
    setUpTimeTable();
    setUpBlockTermin();
}

function setUpTimeTable(){//sets up time Table for Business hours
    var dayNames=["mo","di","mi","don","fr"];//watch out for the don...
    dayNames.forEach(e => {
        let tr = document.getElementById(`t${e}`);
        tr.innerHTML=`<td>${e.charAt(0).toUpperCase()}${e.charAt(1)}</td>`;
        let dayArray = bh[e];
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
                in1.setAttribute("id", `${e}start${i}`);
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
        changeSubmitButtonAppearance(e, but);
    });
    b.addEventListener("blur", function(e){
        changeSubmitButtonAppearance(e, but);
    });
    c.addEventListener("blur", function(e){
        changeSubmitButtonAppearance(e, but);
    });
    d.addEventListener("blur", function(e){
        changeSubmitButtonAppearance(e, but);
    });
    e.addEventListener("blur", function(e){
        changeSubmitButtonAppearance(e, but);
    });
}
function checkTermin(){
    //make Termin
    let message;
    let t = getBlockedTermin();
    let fb = document.getElementById("feedbackBlockTermin");
    if (typeof t !=="object"){
        message = "Eingabefelder sind leer.";
    }else{
        message = provideTerminFeedback(t);
    }
    fb.innerHTML = message;
}
function provideTerminFeedback(termin){
    console.log(termin);
    let fb="";
    let d = termin.date.split(".")[0];
    let m = termin.date.split(".")[1];
    let y = termin.date.split(".")[2];
    if(pastToday(new Date(y, m-1, d))){
        if(withinBusinessHours(termin, bh)){
            if(noTerminConflicts(termin, termine)){
                //safeToDB
                saveTerminToDB(termin);
                fb = "Termin erfolgreich blockiert.";
            }else{
                fb="Termin wurde schon gebucht oder überschneidet sich mit einem bereits gebuchten Termin.";
            }
        }else{
            fb="Termin liegt außerhalb der Geschäftszeiten.";
        }
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
    console.log("Termin erfolgreich in der Datenbank 'Termine' gespeichert.");
}
function changeSubmitButtonAppearance(e, but){//Function für EventListener ("blur") für Inputs: wenn ein Input invalid verlassen wird, ändert sich submitbutton
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
function updateBusinessHours(){//erstellt und speichert neues BusinessHours-Object mit den eingegebenen Werten und passt Layout an
    var dayNames=["mo","di","mi","don","fr"];
    dayNames.forEach(dayName=>{
        for(i=0; i<bh[dayName].length;i++){
            let in1=document.getElementById(`${dayName}start${i}`);//id z.B. mostart0
            let in2=document.getElementById(`${dayName}schluss${i}`);//id z.B. moschluss0
            bh[dayName][i]=`${in1.value}-${in2.value}`;//input an stelle im Array (über)schreiben
        }
        bh[dayName]=bh[dayName].filter(function(str){
            return str!== "-";
        })
        if(bh[dayName][i-1]!=="-"){
            bh[dayName].push("-");
            console.log(i);
        }
    })
    //Safe to Database!!!!

    setUpTimeTable();
    let fb=document.getElementById("feedbackBusinessHours");
    fb.innerHTML="Geschäftszeiten erfolgreich aktualisiert.";
}

function getBlockedTermin(){//returns new Termin mit den Eingabewerten der Inputs der Termin-Reservierungsform
    var f = document.getElementById("makeReservationForm");
    let d = f.elements.day.value;
    let m=f.elements.month.value;
    let y=f.elements.year.value;
    let start=f.elements.startTime.value;
    let end=f.elements.endTime.value;
    let dauer = (Number(end.split(".")[0])-Number(start.split(".")[0]))*4+(Number(end.split(".")[1])-Number(start.split(".")[1]))/15;
    if(d!==""&&m!==""&&y!==""&&start!==""&&end!==""){
        return new Termin(start.split(".")[0], start.split(".")[1], `${d}.${m}.${y}`, "BLOCKED", dauer);
    }else{
        return -1;
    }
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