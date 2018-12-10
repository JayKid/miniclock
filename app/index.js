import clock from "clock";
import document from "document";
import { preferences } from "user-settings";

const TWELVE_HOUR_FORMAT = "12h";
const hours1 = document.getElementById("hours1");
const hours2 = document.getElementById("hours2");
const minutes1 = document.getElementById("minutes1");
const minutes2 = document.getElementById("minutes2");

clock.granularity = "minutes";

clock.ontick = evt => {
    const userWants12HourFormat = preferences.clockDisplay === TWELVE_HOUR_FORMAT;
    let today = evt.date;
    const hours = userWants12HourFormat ?
        String(today.getHours() % 12 || 12).split('') : 
        addPadding(today.getHours()).split('');
    const minutes = addPadding(today.getMinutes()).split('');
    
    hours1.text = hours[0];
    hours2.text = hours[1];
    minutes1.text = minutes[0];
    minutes2.text = minutes[1];
}

const addPadding = number => number < 10 ? `0${number}` : String(number);