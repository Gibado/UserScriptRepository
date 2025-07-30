// ==UserScript==
// @name		Southwest Auto Checkin
// @namespace	https://github.com/Gibado
// @version		2025.07.30.0
// @description	Automatically clicks on the Check in button for checking in for a flight
// @match		https://www.southwest.com/air/check-in/*
// @downloadURL https://github.com/Gibado/UserScriptRepository/raw/master/scripts/SouthwestAutoCheckin.user.js
// @updateURL   https://github.com/Gibado/UserScriptRepository/raw/master/scripts/SouthwestAutoCheckin.user.js
// @copyright	2025
// @author		Tyler Studanski
// @grant		none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    class AutoCheckin {
        constructor() {
            this.help();
        }
        // hour: 0-23 (AM: 0-11, PM: 12-23)
        // minute: 0-59
        // second: 0-59
        scheduleCheckInAt(hour, minute, second) {
            const now = new Date();

            // Set target time for today
            let target = new Date();
            target.setHours(hour);
            if (minute) {
                target.setMinutes(minute);
            }
            if (second) {
                target.setSeconds(second);
            } else {
                target.setSeconds(1);
            }
            target.setMilliseconds(0);

            // If the time has already past, schedule for tomorrow
            if (now > target) {
                target.setDate(target.getDate() + 1);
            }

            const delay = target.getTime() - now.getTime();

            console.log(`Scheduling check in to run in ${Math.round(delay / 1000)} seconds.`);

            setTimeout(checkin, delay);
        }

        // Fucntion to actually click the login button
        checkin() {
            console.log("checkin() triggered at", new Date().toLocaleTimeString());
            document.querySelector('#form-mixin--submit-button').click();
        }
        help() {
            console.log('Call this to start the scheduling');
            console.log('document.autoCheckinModel({hour},[{minute}],[{second}])');
        }
    }
    document.autoCheckinModel = new AutoCheckin();
})();
