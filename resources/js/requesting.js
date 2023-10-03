var anrede, vorname, nachname, mail, phone, leistung;
var date="";
var hour="";
var minute="";
var subButton = document.getElementById("submitButton");
var terminstring ="";
const phoneRegExp=/(\+49|0)\d{11}/;
const mailRegExp=/\w*@\w*\.\w{2,4}/;

//make POST-Request
    

//deliver Booking page
function deliverBooking(e){//Open Modal, Set Up Functionality of Booking modal
    window.scrollTo(0,0);
    let mb =document.getElementById("modalBack");
    let m = document.getElementById("bookingbox");
    mb.style.display="block";
    m.style.display="flex";
    let b = document.body;
    b.style.height="100%";
    b.style.overflow="hidden";
    terminstring = e.id;
    displayDateChosen();
    var select = document.getElementById("leistungsselect");
    console.log(select);
    leistungen.forEach(l=>{
        let opt = document.createElement("option");
        opt.innerHTML=`${l.name}: ${l.preis}`;
        opt.value=`${l.name}`;
        select.appendChild(opt);
    })
    prepareSubmission(terminstring);
    if ("virtualKeyboard" in navigator) {
        navigator.virtualKeyboard.overlaysContent = true;
      }
}
function displayDateChosen(){
    let flag = document.getElementById("zeitpunkt");
    flag.innerHTML=terminstring;
}

function prepareSubmission(terminstring){//Adding eventlistener to button which validates and sanitizes input data
    var f = document.getElementById("bform");
    f.addEventListener("submit", function(e){
        e.preventDefault();
        anrede = f.elements.anrede.value;
        vorname = f.elements.vorname.value;
        nachname = f.elements.nachname.value;
        mail = f.elements.mail.value;
        phone = f.elements.phone.value;
        leistung = f.elements.leistung.value;
        if(nachname == ""||vorname==""){
            let box = document.getElementById("feedback");
            box.innerHTML="";
            let div = document.createElement("div");
            div.innerHTML=`* Vor- und Nachname sind Pflichtfelder.`;
            box.appendChild(div);
        }else{ 
            if(!validMail(mail)){
                let box = document.getElementById("feedback");
                box.innerHTML="";
                let div = document.createElement("div");
                let i = document.getElementById("mailinput");
                i.style.border = "2px solid red";
                div.innerHTML=`* ${mail} ist keine gültige E-Mail-Adresse.`;
                box.appendChild(div);
            }else{
                let i = document.getElementById("mailinput");
                i.style.border = "";
                if(!validPhone(sanitizePhone(phone))){
                    let box = document.getElementById("feedback");
                    box.innerHTML="";
                    let div = document.createElement("div");
                    let i = document.getElementById("phoneinput");
                    i.style.border = "2px solid red";
                    div.innerHTML=`* ${phone} ist keine gültige Telefonnummer.`;
                    box.appendChild(div);
                }else{
                    let i = document.getElementById("phoneinput");
                    i.style.border = "";
                    let box = document.getElementById("feedback");
                    box.innerHTML="";
                    //make POST-Request to enter Termin into database
                    let t = convertToTermin(terminstring, leistung);
                    if(terminPossible(t)){
                        let div = document.createElement("div");
                        div.innerHTML=`Vielen Dank für Ihre Buchung ${anrede} ${nachname}.`;
                        box.appendChild(div);
                    }else{
                        box.innerHTML="Termin außerhalb der Betriebszeiten.";
                    }
                }
            }
        }
    })
}
/*-----------------------------check if Termin to be booked is free and within businesshours------------------------------------*/
function convertToTermin(tstr, l){//macht aus den Inputdaten einen Termin, Format tstr: "dd.mm.yyyy, hh:mm Uhr"
    let date = tstr.split(",")[0];
    let h = tstr.split(",")[1].split(" ")[1].split(":")[0];
    let m = tstr.split(",")[1].split(" ")[1].split(":")[1];
    let leiObj;
    leistungen.forEach(lei=>{
        if(lei.name===l){
            leiObj = lei;
        }
    })
    return new Termin(h, m, date, l, leiObj.dauer);
}
function terminPossible(termin){
    //check if within businesshours
    return withinBusinessHours(termin, bh)&&noTerminConflicts(termin, termine);
}
function withinBusinessHours(termin){//returns true, if selected termin lies within business hours, fals otherwise (booked appointments are NOT considered)
    let startDate = new Date(termin.date.split(".")[2], Number(termin.date.split(".")[1])-1, termin.date.split(".")[0], termin.hourValue, termin.minuteValue);
    let endDate = new Date(startDate.getTime() +termin.dauer*15*60*1000);
    let weekday=bhweekdays[convertToMoSo(startDate.getDay())];//get weekday string to identify corresponding BusinessHours.property
    var compareDates=[];//Aufbauen von Datum-Paaren (für jeden Timeslot im BusinessHourArray ein Paar)
    bh[weekday].forEach(timeslot => {
        if(timeslot!=="-"){
        let start=timeslot.split("-")[0];
        let end=timeslot.split("-")[1];
        let ts = [new Date(termin.date.split(".")[2], Number(termin.date.split(".")[1])-1, termin.date.split(".")[0], start.split(".")[0], start.split(".")[1]),
                  new Date(termin.date.split(".")[2], Number(termin.date.split(".")[1])-1, termin.date.split(".")[0], end.split(".")[0], end.split(".")[1])];
        compareDates.push(ts);}
    });
    if(!compareDates.length){return false;}
    let absUpper=compareDates[compareDates.length-1][1];//oberste timeslot grenze
    let absLower=compareDates[0][0];//untere timeSlotGrenze
    for(i =0;i<compareDates.length;i++){
        let lowBound = compareDates[i][0];
        let UpBound=compareDates[i][1];
        let condition1= (lowBound<startDate&&startDate<UpBound)&&(UpBound<endDate);//untere Grenze ist in BH, obere aber nicht <=> ...
        let condition2=(startDate<lowBound)&&(lowBound<endDate&&endDate<UpBound)//obere Grenze ist drin, untere nicht
        let condition3=(startDate<absLower&&endDate<absLower);
        let condition4=(startDate>absUpper&&endDate>absUpper);
        if(condition1||condition2||condition3||condition4){
            return false;
        }
    }
    return true;
}
function noTerminConflicts(termin, terminList){//returns true, if termin does not conflict with other book appointments, false otherwise
   for(i=0;i<terminList.length;i++){
    let t = terminList[i];
     if(t.date===termin.date){
        let startDate = new Date(termin.date.split(".")[2], Number(termin.date.split(".")[1])-1, termin.date.split(".")[0], termin.hourValue, termin.minuteValue);
        let endDate = new Date(termin.date.split(".")[2], Number(termin.date.split(".")[1])-1, termin.date.split(".")[0], termin.hourValue, termin.minuteValue+termin.dauer*15);
        let startComp = new Date(t.date.split(".")[2], Number(t.date.split(".")[1])-1, t.date.split(".")[0], t.hourValue, t.minuteValue);
        let endComp = new Date(t.date.split(".")[2], Number(t.date.split(".")[1])-1, t.date.split(".")[0], t.hourValue, t.minuteValue+t.dauer*15);
        if(startDate.getTime()<startComp.getTime()&&startComp.getTime()<endDate.getTime()){//wenn zu buchender termin vor gefundenem anfängt und dabei/danach aufhört
            return false;
        }
     }
   }
   return true;

}
function closeModal(){
    let mb =document.getElementById("modalBack");
    let m = document.getElementById("bookingbox");
    mb.style.display="none";
    m.style.display="none";
    let b = document.body;
    b.style.height="auto";
    b.style.overflow="scroll";
    window.location.reload();
}

/*---------------------------------------Validation and Sanitization help methods-----------------------------------*/
function validPhone(str){
    if(str.search(phoneRegExp)==-1){
        return false;
    }else{
        return true;
    }
}
function validMail(str){
    if(str.search(mailRegExp)==-1){
        return false;
    }
    else{
        return true;
    }
}
function sanitizePhone(str){
    let clean= str.replace(/\+49/, "0");
    clean = clean.replaceAll(/( |\.|-)/gi, "");
    return clean;
}
