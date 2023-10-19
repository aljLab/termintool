function getTimeslot(date, hourValue, minuteValue, dauer){//to be called from retrieved termin-objects (because dates cant be recovered from db(JSON))
    dateArr = date.split(".");
    let startDate= new Date(dateArr[2], dateArr[1], dateArr[0], hourValue, minuteValue);
    let endDate=new Date(endDate.getTime()+ 1000*60*15*dauer);
    return new Timeslot(date, startDate, endDate);
}

function noOverlap(ts1, ts2){//checks two timeslots for overlaps
    //entweder liegt ts1 komplett vor ts2 oder danach
    return (tsBefore(ts1, ts2)||tsAfter(ts1, ts2));
}

function within(ts1, ts2){//checks if ts1 is contained in ts2
    return (ts1.startDate>=ts2.startDate && ts1.endDate<=ts2.endDate);
}

function tsBefore(ts1, ts2){ //checks if ts1 lies before ts2 completely
    return (ts1.endDate<=ts2.startDate);
}
function tsAfter(ts1, ts2){//checks if ts1 lies completely after ts2
    return (ts2.endDate<=ts1.startDate);
}

