
//get timeslot from termin-object
function getTimeslot(t){
    dateArr = t.date.split(".");
    let startDate = new Date(dateArr[2], dateArr[1], dateArr[0], t.hourValue, t.minuteValue);
    let endDate = new Date(startDate.getTime() + 1000 * 60 * 15 * t.dauer);
    return new Timeslot(t.date, startDate, endDate);
}
//get timeslot from date, startime and dauer
function getTimeSlotFromRaw(date, startHour, startMin, dauer){
    dateArr = date.split(".");
    let startDate = new Date(dateArr[2], dateArr[1], dateArr[0], startHour, startMin);
    let endDate = new Date(startDate.getTime() + 1000 * 60 * 15 * dauer);
    return new Timeslot(date, startDate, endDate);
}
//BUFFERED TS:= normal TS plus 15 min (+ one time unit)
function getBufferedTimeslot(t){
    dateArr = t.date.split(".");
    let startDate = new Date(dateArr[2], dateArr[1], dateArr[0], t.hourValue, t.minuteValue);
    let endDate = new Date(startDate.getTime() + 1000 * 60 * 15 * (t.dauer+1));
    return new Timeslot(t.date, startDate, endDate);
}
//get buffered timeslot from date, startime and dauer
function getBufferedTimeSlotFromRaw(date, startHour, startMin, dauer){
    dateArr = date.split(".");
    let startDate = new Date(dateArr[2], dateArr[1], dateArr[0], startHour, startMin);
    let endDate = new Date(startDate.getTime() + 1000 * 60 * 15 * (dauer+1));
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

