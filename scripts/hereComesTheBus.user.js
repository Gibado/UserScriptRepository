// ==UserScript==
// @name         Here Comes The Bus Child switch
// @namespace    https://github.com/Gibado
// @version      2022.4.26.1
// @description  Automatically picks a different child based on the time of day
// @author       Tyler Studanski
// @match        https://login.herecomesthebus.com/Map.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=herecomesthebus.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://github.com/Gibado/UserScriptRepository/raw/master/scripts/hereComesTheBus.user.js
// @updateURL    https://github.com/Gibado/UserScriptRepository/raw/master/scripts/hereComesTheBus.user.js
// @copyright	 2022
// @grant        none
// ==/UserScript==

class TimeOfDay {
	static AM = new TimeOfDay("AM");
	static MID = new TimeOfDay("Mid Day");
	static PM = new TimeOfDay("PM");

	constructor(name) {
		this.name = name;
	}
}

document.HCTB = function () {
	var self = this;
	self.timeOfDay = null;
	self.passenger = null;
	self.desiredPmPassengerValue = '3c8d1875-f11d-4125-b605-420670067c42';

	// Main function call
	self.run = function() {
		// Check the time of day
		self.timeOfDay = self.getTimeOfDay();
		self.passenger = self.getPassenger();
		self.printData();
		self.updatePassenger();
	};

	// Debug function
	self.printData = function() {
		console.log('Currently set to ' + self.timeOfDay.name);
		console.log('Selected passenger is: ' + self.prettyPrintPassenger(self.passenger));
	};

	// Prints out passenger information
	self.prettyPrintPassenger = function(passengerOption) {
		return passengerOption.text + '(' + passengerOption.value + ')'
	};

	// Finds the currently set time of day
	self.getTimeOfDay = function() {
		var time = $('#pickTimeOfDay')[0].getElementsByTagName('select')[0].selectedIndex;
		switch(time) {
			case 0:
				return TimeOfDay.AM;
			case 1:
				return TimeOfDay.MID;
			case 2:
				return TimeOfDay.PM;
		}
		return null;
	};

	// Finds the currently selected passenger
	self.getPassenger = function() {
		var passengerDropDown = $('#pickPassenger')[0].getElementsByTagName('select')[0];
		return passengerDropDown[passengerDropDown.selectedIndex];
	};

	// If the time is PM then change selected passenger
	self.updatePassenger = function() {
		if (self.timeOfDay == TimeOfDay.PM && self.passenger.value != self.desiredPmPassengerValue) {
			var passengerDropDown = $('#pickPassenger')[0].getElementsByTagName('select')[0];
			passengerDropDown.value = self.desiredPmPassengerValue;

			var newPassenger = self.getPassenger();
			console.log('Changed passenger from ' + self.prettyPrintPassenger(self.passenger) + ' to ' + self.prettyPrintPassenger(newPassenger));
		} else {
			console.log('Passenger is correct.  No action needed.'); // TODO - Remove later
		}
	};

	return self;
};

var hctbModel = document.HCTB();
hctbModel.run();
