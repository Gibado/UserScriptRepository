// ==UserScript==
// @name         EarnApp Daily Totals
// @namespace    https://github.com/Gibado
// @version      2022.4.14.0
// @description  Adds daily earned totals under the data graph
// @author       Tyler Studanski
// @match        https://earnapp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=earnapp.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://github.com/Gibado/UserScriptRepository/raw/master/scripts/earnappTotals.user.js
// @updateURL    https://github.com/Gibado/UserScriptRepository/raw/master/scripts/earnappTotals.user.js
// @copyright	 2022
// @grant        none
// ==/UserScript==

document.myEarnApp = function() {
	var self = this;
	self.usageData = undefined;
	self.dailyMap = {};

	// Main function to run
	self.run = function() {
		self.reset();
		self.grabUsage();
	};

	// Resets the data properties
	self.reset = function() {
		self.usageData = undefined;
		self.dailyMap = {};
	};

	// Fetches data uses per machine and adds them to the usageData property
	self.grabUsage = function() {
		$.ajax({
			'url' : 'https://earnapp.com/dashboard/api/usage?appid=earnapp_dashboard&version=1.292.111&step=daily',
			'type' : 'GET',
			'success' : function(data) {
				self.usageData = data;
				self.processUsage(self.usageData);
				self.updateCounts(self.dailyMap);
				self.addToPage(self.dailyMap);
			},
			'error' : function(request,error)
			{
				console.error("Request: "+JSON.stringify(request));
			}
		});
	};

	// Totals byte usage for each machine and stores this in the dailyMap property
	self.processUsage = function(usageData) {
		if (usageData === undefined) {
			return;
		}
		for (const machine of usageData) {
			for (const date in machine.data) {
				if (self.dailyMap[date] === undefined) {
					self.dailyMap[date] = {
						bytes: 0,
					};
				}

				self.dailyMap[date].bytes += machine.data[date];
			}
		}
    };

	// Calculates KB, MB, and GB use for each machine and their individual earnings
	self.updateCounts = function(dateMap) {
		for (const dateKey in dateMap) {
			var date = dateMap[dateKey];
			date.kBytes = date.bytes / 1024;
			date.mBytes = date.kBytes / 1024;
			date.gBytes = date.mBytes / 1024;
			date.earnings = self.formatter.format(date.gBytes / 2);
		}
	};

	// Adds/updates display with current data
	self.addToPage = function(results) {

		var display = self.getDisplay();

		for(;display.childElementCount > 0;) {
			display.childNodes[0].remove();
		}

		display.appendChild(self.buildTable(results));
    };

	// Returns existing div to display information or builds a new one
	self.getDisplay = function() {
		var display = document.getElementById('earningDisplay');
		if (display !== null) {
			return display;
		}

		// Build display
		var landing = document.getElementsByClassName('ea_usage_chart')[0];
		display = document.createElement('div');
		display.id = 'earningDisplay';

		landing.appendChild(display);
		return display;
	};

	// Creates table to display statistics to user
	self.buildTable = function(results) {
		var table = document.createElement('table');
		// Add headers
		var headers = document.createElement('tr');
		table.appendChild(headers);
		// Add data
		var dataRow = document.createElement('tr');
		table.appendChild(dataRow);

		Object.keys(results).reverse().forEach(function(date) {

			var header = document.createElement('th');
			header.textContent = date;
			headers.appendChild(header);

			var data = document.createElement('td');
			data.textContent = results[date].earnings;
			dataRow.appendChild(data);
		});

		return table;
	};

	// Debug function
	self.printResults = function() {
		console.log(self.usageData);
		console.log(self.dailyMap);
	};

    // Checks if this is the correct page and waits the intervalTime before checking again
	// intervalTime: time in milliseconds before each check
	self.delayedRun = function(intervalTime) {
		setTimeout(function(){
            if (!self.validateSite()) {
				self.delayedRun(intervalTime);
			} else {
				self.run();
			}
		}, intervalTime);
	};

    // Returns true if the site has the proper information available
    self.validateSite = function() {
        console.log('Checking for valid site...');
        return document.getElementsByClassName('ea_usage_chart').length > 0;
    };

	// Copied from https://stackoverflow.com/a/16233919/3416155
	// Create our number formatter.
	self.formatter = new Intl.NumberFormat('en-US', {
	  style: 'currency',
	  currency: 'USD',

	  // These options are needed to round to whole numbers if that's what you want.
	  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
	  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
	});

	return self;
};

// Delay the run to give the site a chance to load
setTimeout(function() {
	earnAppModel = document.myEarnApp();
	earnAppModel.delayedRun(1000);
}, 10);
