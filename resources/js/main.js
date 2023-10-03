const c = document.getElementById("days");
const dayNames= ["Mo", "Di", "Mi", "Do", "Fr"]; 
var today = new Date(), day=today.getDate(), month=today.getMonth()+1, year= today.getFullYear();
var maxDays, monday = new Date(today.getFullYear(), today.getMonth(), today.getDate()-convertToMoSo(today.getDay()));
var sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate()+(6-convertToMoSo(today.getDay())));
//echtzeitliches Heute
var currentDay=today.getDate(), currentMonth=today.getMonth(), currentYear=today.getFullYear();
//hier werden alle arrays etc. durch db anfragen gefüllt
var termine =[]//[new Termin("09", "30", "19.9.2023","Anamnese", 4), new Termin("11", "30", "19.9.2023", "Untersuchung", 6), new Termin("10", "30", "21.9.2023", "Hallo", 5)];

const leistungen=[
    new Leistung("Esalenmassage (60 Minuten)", 5, "65€"), new Leistung("Esalenmassage (75 Minuten)", 6, "80€"),
    new Leistung("Esalenmassage (90 Minuten)", 7, "95€"), new Leistung("Homöopathische Erstanamnese", 7, "175€"),
    new Leistung("Klassische Homöopathie (Anamnese)",5,"65€"),new Leistung("Traditionelle Tibetische Medizin", 5, "65€"), 
    new Leistung("Beratung/Gespräch", 5, "65€"),new Leistung("Yoga/Atemsitzung", 5, "65€"), new Leistung("Tsa Lung", 5, "65€"), 
    new Leistung("Telefontermin akut", 2, "25€")
    ]; 
const bh= new BusinessHours(["15.00-16.00", "-"],["-"],["10.15-19.00", "-"],["9.30-13.00", "15.00-19.00", "-"],["9.30-13.00", "15.00-19.00", "-"]);
const kunden =[];
const bhweekdays =["mo", "di", "mi", "don", "fr"];
var currentDauer = 4;
/*------------------------------------------Konstruktoren--------------------------------------------*/
//Constructor für Termin
function Termin(h, m, date, leistung, dauer){
    this.hourValue = h;
    this.minuteValue= m;
    this.date = date;
    this.leistung = leistung;//
    this.dauer = dauer;
}
function Leistung(name, dauer, preis){
    this.name = name;
    this.dauer = dauer;
    this.preis = preis;
}
function BusinessHours(mo, di, mi, don, fr){//expects Array with timeslots
    this.mo=mo;
    this.di=di;
    this.mi=mi;
    this.don=don;//Obacht
    this.fr=fr;
}
function Kunde(vorname, nachname, mail, phone, termine){
    this.vorname=vorname;
    this.nachname=nachname;
    this.mail=mail;
    this.phone=phone;
    this.termine=termine;
}

/*------------------------Index Page handling------------------------------*/
function setUp(){
    if(window.innerWidth<=767){
        /*fetchTermine(setUpSmartphoneDays);
        fetchKunden();
        console.log("Smartphone set up finished.");*/
        setUpSmartphoneDays();
    }else if(window.innerWidth<=1024){
        fetchTermine(setUpDays);
        fetchKunden();
        console.log("Tablet set up finished.");
    }else{
        /*fetchTermine(setUpDays);
        fetchKunden();
        console.log(`Desktop set up finished. Kunden: ${kunden}, Termine: ${termine}`);*/
        setUpDays();
    }
}

function setUpDays(){//erstellt 5 divs (eins für jeden Wochentag), appended an #days, erstellt header und setzt id auf =bhweekdays[i]
    setUpNavbar();
    //Tageslots setup------------------------------------------------------------------------
    c.innerHTML="";
    for(i = 0;i<5; i++){
        var a = document.createElement("div");
        var header = document.createElement("div")
        header.setAttribute("class", "dayHeader");
    //Hilfsdatum, um Einzeldaten richtig über den Spalten anzuzeigen
        var tempDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()+i);
        header.innerHTML=`${dayNames[i]} (${tempDate.getDate()}.${tempDate.getMonth()+1}.${tempDate.getFullYear()})`;//Datum ab Montag jeweils um i inkrementiert
        a.appendChild(header);
        a.setAttribute("class", "day");
        a.setAttribute("id", bhweekdays[i]);
        a.style.height= "100%";
        a.style.width= "20%";
        c.appendChild(a);
    }
    //Leistungsselect
    var sel = document.getElementById("chooseLeistung");
    setUpLeistungsDropDown();
    fillLeistungsSelect(sel);
    
    fillDaySlots();
    
    console.log(`Desktop set up finished. Kunden: ${kunden}, Termine: ${termine}`);
}
function fillDaySlots(){
    for(l=0;l<5;l++){
            let div = document.getElementById(`${bhweekdays[l]}`);
            div.innerHTML="";
            let bhArray=bh[bhweekdays[l]];
            bhArray.forEach(timeslot=>{
                let sd = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()+l, timeslot.split("-")[0].split(".")[0], timeslot.split("-")[0].split(".")[1]);
                let ed = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()+l, timeslot.split("-")[1].split(".")[0], timeslot.split("-")[1].split(".")[1]);
                let d = new Date(sd.getTime());
                while(d<(new Date(ed.getTime()-((currentDauer-1)*15*60*1000)))){
                        let date= `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
                        let hour=d.getHours();
                        let minutes=`0${d.getMinutes()}`.slice(-2);
                        let temp=document.createElement("div");
                        if(checkIfTaken(date, hour, minutes)!=false){
                            d=new Date(d.getTime()+((checkIfTaken(date, hour, minutes))*15*60*1000));
                        }else{
                            temp.innerHTML=`${hour}:${minutes}`;
                            temp.setAttribute("class", "timeSlot");
                            let sel = document.getElementById("chooseLeistung");
                            temp.classList.toggle("invalidTimeSlot", sel.value === "--");
                            temp.setAttribute("id", `${date}, ${hour}:${minutes} Uhr`);//Format: 'dd.mm.yyyy, 10:30 Uhr'
                            temp.setAttribute("onclick","deliverBooking(this)");
                            if(pastToday(d)){div.appendChild(temp);}
                            d = new Date(d.getTime()+(15*60*1000));
                        }
            }
        });
    }
}
function checkIfTaken(d, h, m){
    for(let t of termine){
        if(t.date == d&&t.hourValue==h&&t.minuteValue == m){
            return t.dauer;
        }
    }
    return false;
}

function setUpNavbar(){
    //navbar setup-------------------------------------------
    //get Divs from HTMl file
    var l = document.getElementById("lbutton");
    l.innerHTML="";
    var w = document.getElementById("weeksign");
    w.innerHTML="";
    var r = document.getElementById("rbutton");
    r.innerHTML="";
    //create Button und week dísplay + initiate
    var lbutton = document.createElement("button");
    lbutton.innerHTML="<";
    lbutton.style.margin="5px";
    lbutton.setAttribute("onclick", "decrementWeek()");
    var week = document.createElement("div");
    week.innerHTML=getWeekString();
    var rbutton = document.createElement("button");
    rbutton.innerHTML=">";
    rbutton.style.margin="5px";
    rbutton.setAttribute("onclick", "incrementWeek()");
    //appending new Items to parent container
    l.appendChild(lbutton);
    w.appendChild(week);
    r.appendChild(rbutton); 
}
function setUpLeistungsDropDown(){
    var s = document.getElementById("chooseLeistung");
    s.default=
    console.log(s.value);
    s.addEventListener("blur", function(){
        leistungen.forEach(l=>{
            if(l.name == s.value){
                currentDauer=l.dauer;
            }
        })
        if(window.innerWidth<=767){
            fillDaySlot();
        }else{
            fillDaySlots();
        }
    })
}
function convertToMoSo(x){
    //getDay() gibt für Sonntag 0 aus -> gewollt ist Mo = 0 -> So = 6 ---> alle außer So dekrementieren, so 6 mal inkrementieren
    return x != 0? x-1: 6;//returns 0-6(Mo-So)
}
function convertToSoMo(x){
    return (x+1)%7;//returns 0-6 (So-Mo)
}
function getWeekString(){
    //returns stringmit "Montagdatum - Sonntagdatum" der betrachteten Woche
    return `${monday.getDate()}.${monday.getMonth()+1}.${monday.getFullYear()} – ${sunday.getDate()}.${sunday.getMonth()+1}.${sunday.getFullYear()}`;
}
function incrementWeek(){
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
    monday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()+7);
    sunday = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate()+7);
    uptodate();
    setUpDays();
}
function decrementWeek(){
    if(pastToday(new Date(monday.getTime()-3*24*60*60*1000))){//nur dekrementieren wenn mindestens der Freitag letzter Woche noch in der Zukunft liegt
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
        monday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()-7);
        sunday = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate()-7);
        uptodate();
        setUpDays();
    }
}
function uptodate(){//day, month (1-12;Jan-Dez) und year an aktuelles Datum anpassen
    day=today.getDate(); month=today.getMonth()+1; year= today.getFullYear();
}

/*--------mobile Set up()---------------- */
/*--------------------smartphone-------------*/
function setUpSmartphoneDays(){
    setUpNavbarSmartphone();
    //Leistungsselect
    var sel = document.getElementById("chooseLeistung");
    setUpLeistungsDropDown();
    fillLeistungsSelect(sel);
    fillDaySlot();
}
function fillDaySlot(){
    c.innerHTML="";
    let bhprop = bhweekdays[convertToMoSo(today.getDay())];
    let div = document.createElement("div");
    div.style.width="100%";
    div.style.display="flex";
    div.style.flexDirection="column";
    div.style.alignItems="center";
    div.id = bhprop;
    c.appendChild(div);
    //durch timeslots für entsprechenden Wochentag loopen und Terminslots erstellen
    let bhArray = bh[bhprop];
    bhArray.forEach(timeslot=>{
        //pro timeslot: ein Start- (sd) und Enddatum (ed), ein Counterdatum (d)
        let sd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), timeslot.split("-")[0].split(".")[0], timeslot.split("-")[0].split(".")[1]);
        let ed = new Date(today.getFullYear(), today.getMonth(), today.getDate(), timeslot.split("-")[1].split(".")[0], timeslot.split("-")[1].split(".")[1]);
        let d = new Date(sd.getTime());
        while(d<(new Date(ed.getTime()-((currentDauer-1)*15*60*1000)))){
                let date= `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
                let hour=d.getHours();
                let minutes=`0${d.getMinutes()}`.slice(-2);
                let temp=document.createElement("div");
                if(checkIfTaken(date, hour, minutes)!=false){
                    d=new Date(d.getTime()+(15*(checkIfTaken(date, hour, minutes))*60*1000));
                }else{
                    temp.innerHTML=`${hour}:${minutes}`;
                    temp.setAttribute("class", "timeSlot");
                    let sel = document.getElementById("chooseLeistung");
                    temp.classList.toggle("invalidTimeSlot", sel.value === "--");
                    temp.setAttribute("id", `${date}, ${hour}:${minutes} Uhr`);//Format: 'dd.mm.yyyy, 10:30 Uhr'
                    temp.setAttribute("onclick","deliverBooking(this)");
                    if(pastToday(d)){div.appendChild(temp);}
                    d = new Date(d.getTime()+(15*60*1000));
                }
            }
        });
        if(div.innerHTML===""){
            let s = document.createElement("span");
            s.innerHTML="Keine verfügbaren Termine.";
            s.style.fontSize="20px";
            s.style.margin='5px';
            div.appendChild(s);
        }
}
function setUpNavbarSmartphone(){
    //navbar setup smartphone-------------------------------------------
    //get Divs from HTMl file
    var l = document.getElementById("lbutton");
    l.innerHTML="";
    var w = document.getElementById("weeksign");
    w.innerHTML="";
    var r = document.getElementById("rbutton");
    r.innerHTML="";
    //create Button und day dísplay + initiate
    var lbutton = document.createElement("button");
    lbutton.innerHTML="<";
    lbutton.style.margin="5px";
    lbutton.setAttribute("onclick", "decrementDay()");
    var week = document.createElement("div");
    week.innerHTML= `${today.getDate()}.${today.getMonth()+1}.${today.getFullYear()}`;
    week.style.fontSize="20px";
    var rbutton = document.createElement("button");
    rbutton.innerHTML=">";
    rbutton.style.margin="5px";
    rbutton.setAttribute("onclick", "incrementDay()");
    //appending new Items to parent container
    l.appendChild(lbutton);
    w.appendChild(week);
    r.appendChild(rbutton); 

     //Leistungsselect
     var sel = document.getElementById("chooseLeistung");
     setUpLeistungsDropDown();
     fillLeistungsSelect(sel);
}
function incrementDay(){
    if(convertToMoSo(today.getDay())==4){
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate()+3);
        uptodate();
        setUpSmartphoneDays();
    }else{
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
        uptodate();
        setUpSmartphoneDays();
    }
}
function decrementDay(){
    if(pastToday(new Date(today.getTime()-12*60*60*1000))){//nur dekrementieren wenn der vorherige Tag noch in der Zukunft liegt, der Wert ist aber relativ arbiträr
        if(convertToMoSo(today.getDay())==0){
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate()-3);
            uptodate();
            setUpSmartphoneDays();
        }else{
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);
            uptodate();
            setUpSmartphoneDays();
        }
    }
}