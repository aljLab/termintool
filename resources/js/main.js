const c = document.getElementById("days");
const dayNames= ["Mo", "Di", "Mi", "Do", "Fr"]; 
var today = new Date(), day=today.getDate(), month=today.getMonth()+1, year= today.getFullYear();
var maxDays, monday = new Date(today.getFullYear(), today.getMonth(), today.getDate()-convertToMoSo(today.getDay()));
var sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate()+(6-convertToMoSo(today.getDay())));
//echtzeitliches Heute
var currentDay=today.getDate(), currentMonth=today.getMonth(), currentYear=today.getFullYear();
//hier werden alle arrays etc. durch db anfragen gefüllt
var termine =[]//[new Termin("09", "30", "19.9.2023","Anamnese", 4), new Termin("11", "30", "19.9.2023", "Untersuchung", 6), new Termin("10", "30", "21.9.2023", "Hallo", 5)];
var slots= ["09.30", "09.45", "10.00", "10.15", "10.30", "10.45", "11.00", "11.15", "11.30", "11.45","12.00", "15.00", "15.15", "15.30", "15.45", "16.00", "16.15", "16.30",
            "16.45", "17.00", "17.15", "17.30", "17.45", "18.00"];
const leistungen=[
    new Leistung("Esalenmassage (60 Minuten)", 4, "65€"), new Leistung("Esalenmassage (75 Minuten)", 5, "80€"),
    new Leistung("Esalenmassage (90 Minuten)", 6, "95€"), new Leistung("Homöopathische Erstanamnese", 6, "175€"),
    new Leistung("Klassische Homöopathie (Anamnese)",4,"65€"),new Leistung("Traditionelle Tibetische Medizin", 4, "65€"), 
    new Leistung("Beratung/Gespräch", 4, "65€"),new Leistung("Yoga/Atemsitzung", 4, "65€"), new Leistung("Tsa Lung", 4, "65€"), 
    new Leistung("Telefontermin akut", 1, "25€")
    ]; 
const bh= new BusinessHours(["15.00-16.00", "-"],["-"],["10.15-19.00", "-"],["9.30-13.00", "15.00-19.00", "-"],["9.30-13.00", "15.00-19.00", "-"]);
const kunden =[];
const bhweekdays =["mo", "di", "mi", "don", "fr"];
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
    fetchTermine(setUpDays);
    fetchKunden();
    console.log("set up finished.");
}

function setUpDays(){
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
        /*if(i<5){//hardcoded, dass Mo-Mi frei ist!!!
            a.style.backgroundColor="#3b8e9b";
        }else{
            a.style.backgroundColor="var(--lightest-color)";
        }*/
        c.appendChild(a);
    }
    fillDaySlots(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()));
}
function fillDaySlots(){
    for(l=0;l<5;l++){
            let div = document.getElementById(`${bhweekdays[l]}`);
            let bhArray=bh[bhweekdays[l]];
            bhArray.forEach(timeslot=>{
                let sd = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()+l, timeslot.split("-")[0].split(".")[0], timeslot.split("-")[0].split(".")[1]);
                let ed = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()+l, timeslot.split("-")[1].split(".")[0], timeslot.split("-")[1].split(".")[1]);
                let d = new Date(sd.getTime());
                while(d<ed){
                    let date= `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
                    let hour=d.getHours();
                    let minutes=`0${d.getMinutes()}`.slice(-2);
                    let temp=document.createElement("div");
                    if(checkIfTaken(date, hour, minutes)!=false){
                        d+=new Date(d.getTime()+(15*(checkIfTaken(date, hour, minutes)-1)*60*1000));
                    }else{
                        temp.innerHTML=`${hour}:${minutes}`;
                        temp.setAttribute("class", "timeSlot");
                        temp.setAttribute("id", `${date}, ${hour}:${minutes} Uhr`);//Format: 'dd.mm.yyyy, 10:30 Uhr'
                        temp.setAttribute("onclick","deliverBooking(this)");
                        div.appendChild(temp);
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
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    monday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()-7);
    sunday = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate()-7);
    uptodate();
    setUpDays();
}
function uptodate(){//day, month (1-12;Jan-Dez) und year an aktuelles Datum anpassen
    day=today.getDate(); month=today.getMonth()+1; year= today.getFullYear();
}