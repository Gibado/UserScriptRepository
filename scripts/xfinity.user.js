// ==UserScript==
// @name         xFinity data limit addition
// @namespace    https://github.com/Gibado
// @version      2021.10.5.0
// @description  Add extra data analysis to the page
// @author       Tyler Studanski
// @match        https://customer.xfinity.com/
// @icon         https://www.google.com/s2/favicons?domain=xfinity.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://github.com/Gibado/UserScriptRepository/raw/master/scripts/xfinity.user.js
// @updateURL    https://github.com/Gibado/UserScriptRepository/raw/master/scripts/xfinity.user.js
// @copyright	 2021
// @grant        none
// ==/UserScript==

var gibadoModel = function() {
	var self = this;
	
	// How much data has been used so far
	self.dataUsed = -1;
	
	// How much data can be used by the end of today
	self.percentAllowed = -0.5;
	
	// How much data allowed until today
	self.expectedDataUse = -1;
	
	// Data limit for the month
	self.dataCap = 1229;
	
	// Month in JavaScript is 0-indexed (January is 0, February is 1, etc), 
	// but by using 0 as the day it will give us the last day of the prior
	// month. So passing in 1 as the month number will return the last day
	// of January, not February
	// Copied from https://stackoverflow.com/a/1184359/3416155
	self.daysInMonth = function(month, year) {
		return new Date(year, month, 0).getDate();
	};
	
	self.getInfoSpan = function() {
		return $('span[ng-bind-html="usage.details.userMessage.monthlyUsageState"]');
	};
	
	// Collects data off the page
	self.collectData = function() {
		// Grab available data
		var dataText = self.getInfoSpan()[0].firstElementChild.textContent;
		var availableData = parseInt(dataText.replace('GB',''));

		// Calculate data used
		self.dataUsed = self.dataCap - availableData;
		
		// Get day of the month
		var currentDate = new Date();
		var currentDay = currentDate.getDate();
		
		// Get days of the month
		var daysInMonth = self.daysInMonth(currentDate.getMonth() + 1, currentDate.getFullYear());

		// Find % through the month
		self.percentAllowed = currentDay / daysInMonth;
		
		self.expectedDataUse = self.percentAllowed * self.dataCap;
	};
	
	self.getDataDiv = function() {
		return $('.usage-info__monthlyInfo');
	};
	
	// Updates the data on the page
	self.updateValues = function() {
		// Find data usage section div
		var dataDiv = self.getDataDiv()[0];
		// Add info to the page
		var info = document.createElement('p');
		
		// Calculate values
		var percentUsed = self.dataUsed / self.expectedDataUse;
		var remaining = parseInt(self.expectedDataUse - self.dataUsed);
		info.textContent = 'Daily allotment: ' + self.dataUsed + '/' + parseInt(self.expectedDataUse) + ' GB (' + percentUsed.toFixed(2) + '% used) (' + remaining + ' GB remaining for today)';
		
		// Determine status light
		info.classList.add('status');
		if (remaining < 0)
		{
			info.classList.add('status--danger');
		} else if (remaining < 10) {
			info.classList.add('status--warning');
		} else {
			info.classList.add('status--success');
		}
		
		dataDiv.appendChild(info);
	};
	
	// Checks if this page is the page we expect to work with
	self.validateSite = function() {
		console.log('Checking site URL');
		// check URL
		var available = document.location.href.indexOf('#/services/internet#usage') != -1;
		// check elements
		if (available)
		{
			console.log(self.getInfoSpan());
			available = self.getInfoSpan().length != 0;
		}
		if (available) {
			console.log(self.getDataDiv());
			available = self.getDataDiv().length != 0;
		}
		
		return available;
	}
	
	// Function to run after page load
	self.update = function() {
		self.collectData();
		self.updateValues();
	};
	
	// Checks if this is the correct page and waits the intervalTime before checking again
	// intervalTime: time in milliseconds before each check
	self.delayedRun = function(intervalTime) {
		setTimeout(function(){
			if (!self.validateSite()) {
				self.delayedRun(intervalTime);
			} else {
				self.update();
			}
		}, intervalTime);
	};
	
	return self;
};

document.extras = gibadoModel();
document.extras.delayedRun(1000);