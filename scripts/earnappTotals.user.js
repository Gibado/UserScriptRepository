// ==UserScript==
// @name         EarnApp Daily Totals
// @namespace    https://github.com/Gibado
// @version      2022.04.12.0
// @description  Adds daily earned totals under the data graph
// @author       Tyler Studanski
// @match        https://earnapp.com/dashboard
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
	
	self.grabUsage = function() {
		// Reset data
		self.usageData = undefined;
		self.dailyMap = {};
		
		$.ajax({
			'url' : 'https://earnapp.com/dashboard/api/usage?appid=earnapp_dashboard&version=1.292.111&step=daily',
			'type' : 'GET',
			'success' : function(data) {
				self.usageData = data;
				self.processUsage(self.usageData);				
			},
			'error' : function(request,error)
			{
				console.error("Request: "+JSON.stringify(request));
			}
		});
	};
	
	self.processUsage = function(usageData) {
		if (usageData === undefined) {
			return;
		}
		
		for (const machine of usageData) {
			//console.log(machine.name + ' used ' + machine.data);
			for (const date in machine.data) {
				console.log(date + ' - ' + machine.data[date]);
				if (self.dailyMap[date] === undefined) {
					self.dailyMap[date] = { 
						bytes: 0,
					};
				}
				
				self.dailyMap[date].bytes += machine.data[date];
			}
		}
		self.updateCounts(self.dailyMap);
	};
	
	self.updateCounts = function(dateMap) {
		for (const dateKey in dateMap) {
			var date = dateMap[dateKey];
			date.kBytes = date.bytes / 1024;
			date.mBytes = date.kBytes / 1024;
			date.gBytes = date.mBytes / 1024;
			date.earnings = self.formatter.format(date.gBytes / 2);
		}
		self.addToPage(dateMap);
	};
	
	self.addToPage = function(results) {
		var display = self.getDisplay();
		
		for(;display.childElementCount > 0;) {
			display.childNodes[0].remove();
		}
		
		display.appendChild(self.buildTable(results));
		
		self.printResults();
	};
	
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
	
	self.buildTable = function(results) {
		var table = document.createElement('table');
		// Add headers
		var headers = document.createElement('tr');
		table.appendChild(headers);
		// Add data
		var dataRow = document.createElement('tr');
		table.appendChild(dataRow);
		
		//for (const date in results) {
		Object.keys(results).reverse().forEach(function(date) {
			
			var header = document.createElement('th');
			header.textContent = date;
			headers.appendChild(header);
			
			var data = document.createElement('td');
			data.textContent = results[date].earnings;
			dataRow.appendChild(data);
		});
		//}
		
		return table;
	};
	
	self.printResults = function() {
		console.log(self.usageData);
		console.log(self.dailyMap);
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

setTimeout(function() {
	var myEarnApp = document.myEarnApp();
	myEarnApp.grabUsage();
}, 500);
