var anrede, vorname, nachname, mail, phone, leistung;
var date="";
var hour="";
var minute="";
var subButton = document.getElementById("submitButton");
var terminstring ="";
const phoneRegExp=/(\+49|0)\d*/i;
const mailRegExp=/[\w\d\.\-]*@\[\w\d\.\-]*\.\w{1,5}/i;
    

//deliver Booking page
function deliverBooking(e){//handles click on "Buchen"...Open Modal, Set Up Functionality of Booking modal
    if(window.innerWidth<=1024){
        //mobile logic here: store Leistung und Termin in local-storage to navigate to new page to avoid
        //using the modal, as it is bugged on mobile in browser
        let lei = document.getElementById("chooseLeistung").value.split(":")[0];
        let leiObject;
        leistungen.forEach(l=>{
            if(l.name == lei){
                leiObject = l;
            }
        })
        //store termin without customer data in local storage
        let t = new Termin(e.id.split(",")[1].split(" ")[1].split(":")[0], e.id.split(",")[1].split(" ")[1].split(":")[1], e.id.split(",")[0], leiObject, leiObject.dauer, "");
        sessionStorage.setItem("termin", JSON.stringify(t));
        //navigate to booking page for mobile phones
        window.location="mobileBooking.html";
    }else{
        //logic for laptop
        window.scrollTo(0,0);
        let mb =document.getElementById("modalBack");
        let m = document.getElementById("bookingbox");
        mb.style.display="block";
        m.style.display="flex";
        let leftMargin = (window.innerWidth-m.offsetWidth)/2;
        m.style.left=leftMargin.toString()+"px";
        //let b = document.body;
        //b.style.height="100%";
        //b.style.overflow="hidden";
        terminstring = e.id;//dd.mm.yyyy, 10:30 Uhr
        displayDateChosen();
        var select = document.getElementById("leistungsselect");
        fillLeistungsSelectbooking(select, document.getElementById("chooseLeistung").value);
        select.value = document.getElementById("chooseLeistung").value;
        prepareSubmission(terminstring);
    }
}
//for mobile only: normal is below, almost exact copy
function prepareBookingMobile(){
    //get Termin-Object (OHNE KUNDENINFO) aus session Storage!
    let f = document.getElementById("bformMobile");
    let t = JSON.parse(sessionStorage.getItem("termin"));
    let zp = document.getElementById("zeitpunktMobile");
    let ls = document.getElementById("leistungsselectMobile");
    zp.innerHTML=`${t.date}, ${t.hourValue}:${t.minuteValue} Uhr`;
    fillLeistungsSelectbooking(ls, t.leistung.name);
    ls.value = t.leistung.name;
    f.addEventListener("submit", function(e){//Logik, die überprüft ob Eingaben korrekt waren etc. und anschließend bucht
        e.preventDefault();
        anrede = f.elements.anrede.value;
        vorname = f.elements.vorname.value;
        nachname = f.elements.nachname.value;
        mail = f.elements.mail.value;
        phone = f.elements.phone.value;
        leistung = f.elements.leistung.value;
        if(nachname == ""||vorname==""){
            let box = document.getElementById("feedbackMobile");
            box.innerHTML="";
            box.innerHTML=`* Vor- und Nachname sind Pflichtfelder.`;
        }else{ 
            if(!validMail(mail)){
                let box = document.getElementById("feedbackMobile");
                box.innerHTML="";
                let div = document.createElement("div");
                let i = document.getElementById("mailinputMobile");
                i.style.border = "2px solid red";
                div.innerHTML=`* ${mail} ist keine gültige E-Mail-Adresse.`;
                box.appendChild(div);
            }else{
                let i = document.getElementById("mailinputMobile");
                i.style.border = "";
                if(!validPhone(sanitizePhone(phone))){
                    let box = document.getElementById("feedbackMobile");
                    box.innerHTML="";
                    let div = document.createElement("div");
                    let i = document.getElementById("phoneinputMobile");
                    i.style.border = "2px solid red";
                    div.innerHTML=`* ${phone} ist keine gültige Telefonnummer.`;
                    box.appendChild(div);
                }else{
                    let i = document.getElementById("phoneinputMobile");
                    i.style.border = "";
                    let box = document.getElementById("feedbackMobile");
                    box.innerHTML="";
                    //make POST-Request to enter Termin into database
                    if(withinBusinessHours(t, bh)){
                        if(noTerminConflicts(t)){
                            box.innerHTML=`Vielen Dank für Ihre Buchung ${anrede} ${nachname}.`;
                            t.kunde = new Kunde(anrede, sanitizeText(vorname), sanitizeText(nachname), mail.toLowerCase(), sanitizePhone(phone));
                            insertTermin(t);
                            insertKunde(t.kunde);
                            sendMail(t);
                            sendMailNotification(t);
                            f.reset();
                            let buchenButton = document.getElementById("submitButtonMobile");
                            buchenButton.style="display:none;";
                            let bb = document.getElementById("backButtonMobile");
                            bb.innerHTML="Zurück zum Kalender";
                            bb.addEventListener("click", ()=>{
                                window.location="index.html";
                            });
                            bb.style.display="block";
                        }else{
                            box.innerHTML="Termin überschneidet sich mit bereits gebuchtem Termin!";
                        }
                    }else{
                        box.innerHTML="Termin außerhalb der Betriebszeiten.";
                    }
                }
            }
        }
    })

}
function getDauer(n){
    for(i=0;i<leistungen.length;i++){
        if(leistungen[i].name===n){
            return leistungen[i].dauer;
        }
    }
}
function getPreis(n){
    for(i=0;i<leistungen.length;i++){
        if(leistungen[i].name===n){
            return leistungen[i].preis;
        }
    }
}
function fillLeistungsSelect(select){
    if(select!==null){
        select.innerHTML="<option selected>--</option>";
        leistungen.forEach(l=>{
            let opt = document.createElement("option");
            opt.innerHTML=`${l.name}: ${l.preis}`;
            opt.value=`${l.name}`;
            select.appendChild(opt);
        })
    }
}
function fillLeistungsSelectbooking(select, value){
    if(select!==null){
        //select.innerHTML="<option selected>--</option>";
        leistungen.forEach(l=>{
            if(l.name==value){
                let opt = document.createElement("option");
                opt.innerHTML=`${l.name}: ${l.preis}`;
                opt.value=`${l.name}`;
                select.appendChild(opt);
            }
        })
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
            box.innerHTML=`* Vor- und Nachname sind Pflichtfelder.`;
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
                    if(withinBusinessHours(t, bh)){
                        if(noTerminConflicts(t)){
                            box.innerHTML=`Vielen Dank für Ihre Buchung ${anrede} ${nachname}.`;
                            t.kunde = new Kunde(anrede, sanitizeText(vorname), sanitizeText(nachname), mail.toLowerCase(), sanitizePhone(phone));
                            insertTermin(t);
                            insertKunde(t.kunde);
                            sendMail(t);
                            sendMailNotification(t);
                            f.reset();
                            let buchenButton = document.getElementById("submitButton");
                            buchenButton.style="display:none;";
                        }else{
                            box.innerHTML="Termin überschneidet sich mit bereits gebuchtem Termin!";
                        }
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
    return new Termin(h, m, date, leiObj, leiObj.dauer, "");
}
function withinBusinessHours(termin){//returns true, if selected termin lies within business hours, fals otherwise (booked appointments are NOT considered)
    let startDate = new Date(termin.date.split(".")[2], Number(termin.date.split(".")[1])-1, termin.date.split(".")[0], termin.hourValue, termin.minuteValue);
    let endDate = new Date(startDate.getTime() +termin.dauer*15*60*1000);
    let weekday=bhweekdays[convertToMoSo(startDate.getDay())];//get weekday string to identify corresponding BusinessHours.property
    var compareDates=[];//Aufbauen von Datum-Paaren (für jeden Timeslot im BusinessHourArray ein Paar)
    if(!weekday){
        return false;
    }else{
        bh[weekday].forEach(timeslot => {
            if(timeslot!=="-"){
            let start=timeslot.split("-")[0];
            let end=timeslot.split("-")[1];
            let ts = [new Date(termin.date.split(".")[2], Number(termin.date.split(".")[1])-1, termin.date.split(".")[0], start.split(".")[0], start.split(".")[1]),
                      new Date(termin.date.split(".")[2], Number(termin.date.split(".")[1])-1, termin.date.split(".")[0], end.split(".")[0], end.split(".")[1])];
            compareDates.push(ts);}
        });
    }
    if(!compareDates.length){return false;}
    let absUpper=compareDates[compareDates.length-1][1];//oberste timeslot grenze
    let absLower=compareDates[0][0];//untere timeSlotGrenze
    for(i =0;i<compareDates.length;i++){
        let lowBound = compareDates[i][0];
        let UpBound=compareDates[i][1];
        let condition1= (lowBound<startDate&&startDate<UpBound)&&(UpBound<endDate);//untere Grenze ist in BH, obere aber nicht <=> ...
        let condition2=(startDate<lowBound)&&(lowBound<endDate)//obere Grenze ist drin, untere nicht
        let condition3=(startDate<absLower||endDate>absUpper);
        if(condition1||condition2||condition3){
            return false;
        }
    }
    return true;
}
function noTerminConflicts(termin){//returns true, if termin does not conflict with other book appointments, false otherwise
   for(i=0;i<termine.length;i++){
     let t = termine[i];
     console.log(t);
     if(t.date===termin.date){
        if (!noOverlap(getTimeslot(t), getTimeslot(termin)))
            return false;
        }
    }
    return true;
}
function closeModal(){
    location.reload();
    /*let mb =document.getElementById("modalBack");
    let m = document.getElementById("bookingbox");
    mb.style.display="none";
    m.style.display="none";
    let b = document.body;
    b.style.height="auto";
    b.style.overflow="scroll";
    let fb = document.getElementById("feedback");
    fb.innerHTML="";*/
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
function sanitizeText(str){
    let clean = str.replaceAll(/( |\.|-)/gi, "");
    return clean;
}
