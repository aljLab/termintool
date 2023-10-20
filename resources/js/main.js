const c = document.getElementById("days");
const dayNames= ["Mo", "Di", "Mi", "Do", "Fr"]; 
if(convertToMoSo(new Date().getDay())<5){
    today = new Date();
}else{
    today=new Date(new Date().getTime()+(7-convertToMoSo(new Date().getDay()))*(24*60*60*1000));
}
var day=today.getDate(), month=today.getMonth()+1, year= today.getFullYear();
var maxDays, monday = new Date(today.getFullYear(), today.getMonth(), today.getDate()-convertToMoSo(today.getDay()));
var sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate()+(6-convertToMoSo(today.getDay())));
//echtzeitliches Heute
var currentDay=today.getDate(), currentMonth=today.getMonth(), currentYear=today.getFullYear();
//hier werden alle arrays etc. durch db anfragen gefüllt
var termine =[]/*[new Termin("09", "30", "12.10.2023","Anamnese", 5, new Kunde("Dr.", "Aljoscha", "Lustig", "a@b.com", "017623559949", [])), 
new Termin("11", "30", "5.10.2023", "Untersuchung", 7, new Kunde("Herr","Wolfram", "Ebert", "w.ebert@web.com", "+49 1982736475")), 
new Termin("09", "30", "19.10.2023","Herzyoga", 5, new Kunde("Frau", "Amaya", "Papaya", "amalulu@b.com", "017623552e398", [])), 
new Termin("15", "30", "24.10.2023","Telefontermin", 2, new Kunde("Frau", "Doris", "Piesler", "example@beta.com", "0176223987239", []))];//, new Termin("10", "30", "21.9.2023", "Hallo", 5)];*/
const admin = new Kunde("Admin", "", "", "aljoschalabonte@rocketmail.com", "XXX", []);
const leistungen=[
    new Leistung("Esalenmassage (60 Minuten)", 4, "65€"), new Leistung("Esalenmassage (75 Minuten)", 5, "80€"),
    new Leistung("Esalenmassage (90 Minuten)", 6, "95€"), new Leistung("Homöopathische Erstanamnese", 6, "175€"),
    new Leistung("Klassische Homöopathie (Anamnese)",4,"65€"),new Leistung("Traditionelle Tibetische Medizin", 4, "65€"), 
    new Leistung("Beratung/Gespräch", 4, "65€"),new Leistung("Yoga/Atemsitzung", 4, "65€"), new Leistung("Tsa Lung", 4, "65€"), 
    new Leistung("Telefontermin akut", 1, "25€")
    ]; 
const bh= new BusinessHours(["-"],["-"],["-"],["9.30-13.00", "15.00-19.00", "-"],["9.30-13.00", "15.00-19.00", "-"]);
const kunden =[];//[new Kunde("Frau", "Amaya", "Papaya", "amalulu@b.com", "017623552e398", []), new Kunde("Frau", "Doris", "Piesler", "example@beta.com", "0176223987239", [])];
const bhweekdays =["mo", "di", "mi", "don", "fr"];
var currentDauer = 4;
const imageRefs=["/termintool/resources/images/calendar-blank-icon.svg", "/termintool/resources/images/clock-line-icon.svg","/termintool/resources/images/diary-icon.svg","/termintool/resources/images/boys-icon.svg","/termintool/resources/images/service-provider-icon.svg"];
/*------------------------------------------Konstruktoren--------------------------------------------*/
//Constructor für Termin
function Termin(h, m, date, leistung, dauer, kunde){
    this.hourValue = h;
    this.minuteValue= m;
    this.date = date;
    this.leistung = leistung;//
    this.dauer = dauer;
    this.kunde = kunde;
}
function Timeslot(dateString, startDate, endDate){
    this.date = dateString;
    this.startDate= startDate;
    this.endDate=endDate;
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
function Kunde(anrede, vorname, nachname, mail, phone, termine){
    this.anrede = anrede;
    this.vorname=vorname;
    this.nachname=nachname;
    this.mail=mail;
    this.phone=phone;
    this.termine=termine;
}

/*------------------------Index Page handling------------------------------*/
function setUp(){
    if(window.innerWidth<=767){
        fetchTermine(fillDaySlot);
        fetchKunden();
        console.log("Smartphone set up finished.");
        setUpNavbarSmartphone();
        //equipFormInputsForMobile();
        //Leistungsselect
        var sel = document.getElementById("chooseLeistung");
        setUpLeistungsDropDown();
        fillLeistungsSelect(sel);
    }else{
        fetchTermine(fillDaySlots);
        //fetchKunden();
        setUpNavbar();
        setUpDays();
        var sel = document.getElementById("chooseLeistung");
        setUpLeistungsDropDown();
        fillLeistungsSelect(sel);
    }
}
function setUpCalendar(){
    if(window.innerWidth<=767){
        /*fetchTermine(setUpSmartphoneDays);
        fetchKunden();
        console.log("Smartphone set up finished.");*/
        adaptSideBar();
        setUpNavbarSmartphone();
        fillDaySlot();
    }else{
        /*fetchTermine(setUpDays);
        fetchKunden();
        console.log(`Desktop set up finished. Kunden: ${kunden}, Termine: ${termine}`);*/
        setUpNavbar();
        setUpDays();
        fillDaySlots();
    }
}
function setUpDays(){//erstellt 5 divs (eins für jeden Wochentag), appended an #days, erstellt header und setzt id auf =bhweekdays[i]
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
}
function fillDaySlots(){
    for(l=0;l<5;l++){
            let div = document.getElementById(`${bhweekdays[l]}`);
            while (div.childNodes.length > 1) {
                div.removeChild(div.lastChild);
            }
            let bhArray=bh[bhweekdays[l]];
            bhArray.forEach(timeslot=>{
                let sd = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()+l, timeslot.split("-")[0].split(".")[0], timeslot.split("-")[0].split(".")[1]);
                let ed = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()+l, timeslot.split("-")[1].split(".")[0], timeslot.split("-")[1].split(".")[1]);
                let d = new Date(sd.getTime());
                while(d<(new Date(ed.getTime()-((currentDauer)*15*60*1000)))){
                        //initialisierungen
                        let date= `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;//datestring: eg. "9.7.2023"
                        let hour=d.getHours();
                        let minutes=`0${d.getMinutes()}`.slice(-2);
                        //HTML-Element
                        let temp=document.createElement("div");//timeslot html element

                        //Logic
                        if(taken(date, hour, minutes)){//wenn timeslot taken by termin -> counter um die Dauer (+1) inkrementieren
                            d=new Date(d.getTime()+((taken(date, hour, minutes))*15*60*1000));
                        }else if(checkFutureSlots(currentDauer, date, hour, minutes)!=false){
                            let i = checkFutureSlots(currentDauer, date, hour, minutes);
                            console.log(` i= ${i}`);
                            d = new Date(d.getTime()+1000*60*15*i);
                        }else{
                            temp.innerHTML=`${hour}:${minutes}`;
                            temp.setAttribute("class", "timeSlot");
                            if(window.location.pathname==="/termintool/index.html"){
                                let sel = document.getElementById("chooseLeistung");
                                temp.classList.toggle("invalidTimeSlot", sel.value === "--");
                                temp.setAttribute("onclick","deliverBooking(this)");
                            }
                            temp.setAttribute("id", `${date}, ${hour}:${minutes} Uhr`);//Format: 'dd.mm.yyyy, 10:30 Uhr'
                            if(pastToday(d)){
                                div.appendChild(temp);
                            }
                            d = new Date(d.getTime()+(15*60*1000));
                        }
            }
            console.log(`${l}st one done.`);
        });
    }
}
function checkFutureSlots(dauer, date, hourValue, minuteValue){
    for(i =1;i<=dauer;i++){
        let h = hourValue;
        let m = (Number(minuteValue)+15*i)%15;
        if (m==0){
            h++;
        }
        if(taken(date, h, m)){
            return i;
        }
    }
    return false;
}
function taken(d, h, m){
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
    setUpNavbar();
    setUpDays();
    fillDaySlots();
}
function decrementWeek(){
    if(pastToday(new Date(monday.getTime()-3*24*60*60*1000))){//nur dekrementieren wenn mindestens der Freitag letzter Woche noch in der Zukunft liegt
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
        monday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()-7);
        sunday = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate()-7);
        uptodate();
        setUpNavbar();
        setUpDays();
        fillDaySlots();
    }
}
function uptodate(){//day, month (1-12;Jan-Dez) und year an aktuelles Datum anpassen
    day=today.getDate(); month=today.getMonth()+1; year= today.getFullYear();
}

/*--------mobile Set up()---------------- */
/*--------------------smartphone-------------*/
function adaptSideBar(){
    let sb = document.getElementById("sidebar");
    let i = 0;
    console.log(sb.children);
    console.log(sb.className);
    Array.from(sb.children).forEach(n=>{
        if(n.className ==="listItem"){
            n.innerHTML=`<img class ='sidebarIcon' src=${imageRefs[i]}>`;
            i++;
        }else if(n.id=="currentItem"){
            i++;
        }
    })
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
        while(d<(new Date(ed.getTime()-((currentDauer+1)*15*60*1000)))){
                let date= `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
                let hour=d.getHours();
                let minutes=`0${d.getMinutes()}`.slice(-2);
                let temp=document.createElement("div");
                console.log(taken(date, hour, minutes));
                if(taken(date, hour, minutes)!=false){
                    d=new Date(d.getTime()+(15*(taken(date, hour, minutes))*60*1000));
                }else{
                    temp.innerHTML=`${hour}:${minutes}`;
                    temp.setAttribute("class", "timeSlot");
                    if(window.location.pathname==="/termintool/index.html"){
                        let sel = document.getElementById("chooseLeistung");
                        temp.classList.toggle("invalidTimeSlot", sel.value === "--");
                        temp.setAttribute("onclick","deliverBooking(this)");
                    }
                    temp.setAttribute("id", `${date}, ${hour}:${minutes} Uhr`);//Format: 'dd.mm.yyyy, 10:30 Uhr'
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
}
function incrementDay(){
    if(convertToMoSo(today.getDay())==4){
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate()+3);
        uptodate();
        setUpNavbarSmartphone();
        fillDaySlot();
    }else{
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
        uptodate();
        setUpNavbarSmartphone();
        fillDaySlot();
    }
}
function decrementDay(){
    if(pastToday(new Date(today.getTime()-18*60*60*1000))){//nur dekrementieren wenn der vorherige Tag noch in der Zukunft liegt, der Wert ist aber relativ arbiträr
        if(convertToMoSo(today.getDay())==0){
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate()-3);
            uptodate();
            setUpNavbarSmartphone();
            fillDaySlot();
        }else{
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);
            uptodate();
            setUpNavbarSmartphone();
            fillDaySlot();
        }
    }
}
function testKundenInsertion(){
    insertKunde(new Kunde("Frau", "Amaya", "Papaya", "amalulu@b.com", "017623552e398", []));
}
