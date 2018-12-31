import clock from "clock";
import document from "document";
import { today } from "user-activity";
import { battery } from "power";
import { HeartRateSensor } from "heart-rate";
import { preferences } from "user-settings";

const TWELVE_HOUR_FORMAT = "12h";
const hours1 = document.getElementById("hours1");
const hours2 = document.getElementById("hours2");
const minutes1 = document.getElementById("minutes1");
const minutes2 = document.getElementById("minutes2");
const additionalInfo = document.getElementById("additionalInfo");
const clockGroup = document.getElementById("clock-group");

// Initialize
clock.granularity = "minutes";
let hrm = new HeartRateSensor();
let additionalInfoIndex = 0;

const getSteps = _ => `${today.local.steps || 0} steps`,
const getDate = _ => `${new Date().toDateString().replace(/\-/g,'/')}`,
const getBatteryLevel = _ => `${Math.floor(battery.chargeLevel)}%`;
const getCalories = _ => `${today.local.calories} cal`;
const getDistance = _ => `${today.local.distance} m`;
const getHeartRate = _ => {
    hrm.onreading = _ => {
        additionalInfo.text = `${hrm.heartRate || 0} bpm`;
    }
    hrm.start();
    return `? bpm`;
}
const addPadding = number => number < 10 ? `0${number}` : String(number);

const additionalInfoHandlers = [
    _ => {
        // Stop heart rate measurements
        hrm.stop();
        // Center clock again
        clockGroup.groupTransform.translate.y = 0;
        return '';
    },
    _ => {
        // Move clock slightly up to make space for additional information
        clockGroup.groupTransform.translate.y = -40;
        return getBatteryLevel()
    },
    _ => getDate(),
    _ => getSteps(),
    _ => getDistance(),
    _ => getCalories(),
    _ => getHeartRate(),
];

const getAdditionalInfo = _ => additionalInfoHandlers[additionalInfoIndex]()
const refreshAdditionalInfo = _ => additionalInfo.text = getAdditionalInfo()

// On screen touch, rotate additional info displayed
document.getElementById('screen').onclick = function() {
    additionalInfoIndex = (additionalInfoIndex+1) % additionalInfoHandlers.length;
    refreshAdditionalInfo();
}

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

    additionalInfo.text = getAdditionalInfo();
}
