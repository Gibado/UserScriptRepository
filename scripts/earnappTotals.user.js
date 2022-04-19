// ==UserScript==
// @name         EarnApp Daily Totals
// @namespace    https://github.com/Gibado
// @version      2022.4.19.0
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
	self.deviceMap = {};

	// Main function to run
	self.run = function() {
		self.reset();
		self.grabUsage();
	};

	// Resets the data properties
	self.reset = function() {
		self.usageData = undefined;
		self.dailyMap = {};
		self.deviceMap = {};
	};

	// Fetches data uses per machine and adds them to the usageData property
	self.grabUsage = function() {
		$.ajax({
			'url' : 'https://earnapp.com/dashboard/api/usage?appid=earnapp_dashboard&version=1.292.111&step=daily',
			'type' : 'GET',
			'success' : function(data) {
				self.usageData = data;
				self.processUsage(self.usageData);
				self.updateCounts(self.dailyMap, self.deviceMap);
				self.addToPage(self.dailyMap, self.deviceMap);
			},
			'error' : function(request,error)
			{
				console.error("Request: "+JSON.stringify(request));
			}
		});
	};

	// Adds data to deviceMap property and Totals byte usage for each machine in the dailyMap property
	self.processUsage = function(usageData) {
		if (usageData === undefined) {
			return;
		}
		var total = undefined;
		for (const machine of usageData) {
			self.deviceMap[machine.name] = {
				data: JSON.parse(JSON.stringify(machine.data))
			};

			// Calculate daily totals
			if (total === undefined) {
				total = JSON.parse(JSON.stringify(self.deviceMap[machine.name]));
			} else {
				for (const date in machine.data) {
					total.data[date] += machine.data[date];
				}
			}

			for (const date in machine.data) {
				if (self.dailyMap[date] === undefined) {
					self.dailyMap[date] = {
						bytes: 0,
					};
				}
			}
		}

		// Calculate daily averages
		self.deviceMap.Average = JSON.parse(JSON.stringify(total));
		for (const date in self.deviceMap.Average.data) {
			self.deviceMap.Average.data[date] /= 7;
		}
		self.deviceMap.Total = total;
    };

	// Calculates KB, MB, and GB use for each machine and their individual earnings
	self.updateCounts = function(dateMap, deviceMap) {
		for (const dateKey in dateMap) {
			var date = dateMap[dateKey];
			date.kBytes = date.bytes / 1024;
			date.mBytes = date.kBytes / 1024;
			date.gBytes = date.mBytes / 1024;
			date.earnings = self.formatter.format(date.gBytes / 2);
		}

		for (const device in deviceMap) {
			// Convert all bytes to GB
			deviceMap[device].totalGBytes = 0;
			for (const date in deviceMap[device].data) {
				deviceMap[device].data[date] /= Math.pow(1024,3); // kilo-, mega-, and giga-byte
				deviceMap[device].totalGBytes += deviceMap[device].data[date];
			}
			// Add device average
			deviceMap[device].avgGBytes = deviceMap[device].totalGBytes / 7;

			// Add Earnings
			deviceMap[device].totalEarnings = self.formatter.format(deviceMap[device].totalGBytes / 2);
			deviceMap[device].avgEarnings = self.formatter.format(deviceMap[device].avgGBytes / 2);
		}
	};

	// Adds/updates display with current data
	self.addToPage = function(results, deviceMap) {

		var display = self.getDisplay();

		for(;display.childElementCount > 0;) {
			display.childNodes[0].remove();
		}

		display.appendChild(self.buildTable(results, deviceMap));
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
	self.buildTable = function(results, deviceMap) {
		var table = document.createElement('table');
		table.border = 1;
		// Add headers
		var headers = document.createElement('tr');
		table.appendChild(headers);

		var headerData = ['Device'];
		headerData = headerData.concat(Object.keys(deviceMap.Total.data).reverse());
		headerData = headerData.concat('Avg GB', 'Total GB', 'Avg $', 'Total $');

		self.createRow('th', headers, headerData);

		// Object.keys(results).reverse().forEach(function(date) {

			// var header = document.createElement('th');
			// header.textContent = date;
			// headers.appendChild(header);

			// var data = document.createElement('td');
			// data.textContent = results[date].earnings;
			// deviceRow.appendChild(data);
		// });

		Object.keys(deviceMap).forEach(function(device) {
			// Add data
			var deviceRow = document.createElement('tr');
			table.appendChild(deviceRow);

			var dataRow = [device];
			Object.values(deviceMap[device].data).reverse().forEach(function(total) {
				dataRow = dataRow.concat(total.toFixed(2));
			});
			dataRow = dataRow.concat(deviceMap[device].avgGBytes.toFixed(2), deviceMap[device].totalGBytes.toFixed(2), deviceMap[device].avgEarnings, deviceMap[device].totalEarnings);

			self.createRow('td', deviceRow, dataRow);
		});

		return table;
	};

	// Adds the given data to a table row with the given type (th/td)
	self.createRow = function(elementType, parentElement, dataArray) {
		Object.values(dataArray).forEach(function(data) {
			var column = document.createElement(elementType);
			column.textContent = data;
			parentElement.appendChild(column);
		});
	};

	// Debug function
	self.printResults = function() {
		console.log(self.usageData);
		console.log(self.dailyMap);
		console.log(self.deviceMap);
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
