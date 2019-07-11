/**
 *	Created by Tyler Studanski on January 28th, 2015
 * 	Updated: April 16, 2015
 *	Version 1.4
 *  
 *  Cookie functions and maintenance UI
 */
 
/**
 *	Version History
 *	1.4		- UI changes to fix issues with sites that have a large 
 *			number of cookies.  Also forced the cookie editor to be at 
 *			the front of any website.
 *	1.3		- Changed method references to start from document level to 
 *			support functionality when accessed through userscript 
 *			require tags.
 *	1.2		- Changed element ID values to minimize the probablility of
 *			ID collision.
 *	1.1		- Fixed issue with startService() so that new required 
 *			cookies are registered correctly.  Removed commented code.
 *	1.0		- First working version.  Has UI and allows for adding
 *			cookies, deleting cookies, and updating cookie values.
 *			Also understands required cookies.
 */
 
/**
 *	TODO List
 *		- Make it so that the update button is not needed
 */
 
if (typeof(document.gibado)==='undefined') {
	document.gibado = {};
}
if (typeof(document.gibado.util)==='undefined') {
	document.gibado.util = {};
}

document.gibado.util = {
	/**
	 *	Assign a cookie to be added
	 */
	addCookie: function (id) {
		var nameId = id + 'NAME';
		var valueId = id + 'VALUE';
		var cookie = {
			name: document.getElementById(nameId).value,
			value: document.getElementById(valueId).value
		};
		document.cookieChanges.adds.push(cookie);
	},

	/**
	 * Finds existing cookies and assigns the object version to a global
	 * variable
	 */
	assignCookieObjList: function () {
		var cookies = document.cookie.split('; ').sort();
		var cookieList = [];
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i].split('=');
			var obj = this.cookieObj(cookie[0], cookie[1]);
			cookieList.push(obj);
		}
		
		return cookieList;
	},

	/**
	 * Generates Cookie Editor table
	 */
	buildCookiePanel: function () {
		var content = '<tr><th>Cookie Name</th><th>Cookie Value</th></tr>';
		var cookieList = document.myCookieList;
		var classPath = 'document.gibado.util.';
		for (var i = 0; i < cookieList.length; i++) {
			var cookie = cookieList[i];
			var cookieId = 'COOKIE'+cookie.name;
			content += '<tr>';
			content += '<td>' + cookie.name + '</td>';
			content += '<td><input type=\'text\' id=\'' + cookieId + '\'value=\'' + cookie.value + '\'/></td>';
			content += "<td><button onclick=\"" + classPath + "updateCookie(\'" + cookieId + "\');" + classPath + "updateRow(this);\">Update</button></td>"
			content += "<td><button onclick=\"" + classPath + "deleteCookieObj(\'" + cookie.name +"\');" + classPath + "updateRow(this);\">Delete</button></td>"
			content += '</tr>';
		}
		
		// For a new cookie
		content += '<tr>';
		content += '<td><input type=\'text\' id=\'newNAME\' /></td>';
		content += '<td><input type=\'text\' id=\'newVALUE\' /></td>';
		content += "<td><button  onclick=\"" + classPath + "addCookie(\'new\');" + classPath + "updateRow(this);\">Add</button></td>"
		content += '</tr>';
		
		content += "<tr>";
		content += "<td><button  onclick=\'" + classPath + "save();" + classPath + "removePanel(false);\'>Save/Close</button></td>";
		content += "<td><button onclick=\'" + classPath + "removePanel(false)\'>Close</button></td>"
		content += "</tr>";
		return content;
	},
	
	/**
	 * Makes sure required cookies exist
	 * rCookies: Array of cookie objects {name: cookie name, value: default value}
	 */
	checkRequiredCookies: function (rCookies) {
		for (var i = 0; i < rCookies.length; i++) {
			var cookie=this.getCookie(rCookies[i].name);
			if (cookie === "") {
					this.setCookie(rCookies[i].name, rCookies[i].value, 365);
			}
		}
	},
	
	/**
	 * Opens the cookie editor panel
	 */
	cookieEditor: function () {
		this.removePanel(true);
		this.init();
		
		var divObj = document.createElement('div');
		divObj.style.overflow = 'auto';
		divObj.style.maxHeight = '200px';
		divObj.style.maxWidth = '50%';
		divObj.style.position = 'fixed';
		divObj.style.zIndex = '1000';
		divObj.style.top = '10px';
		divObj.style.left = '10px';
		divObj.style.padding = '20px';
		divObj.style.backgroundColor = '#fff';
		divObj.style.color = 'black';
		divObj.className = 'cookiePanel';
		
		menuobj = document.createElement('table');
		
		var panelText = this.buildCookiePanel();
		menuobj.innerHTML = panelText;
		body = document.getElementsByTagName('body')[0];
		
		divObj.appendChild(menuobj);
		body.appendChild(divObj);
	},

	/**
	 * Generates a cookie object
	 * 
	 * name: cookie's name
	 * value: the cookie's value
	 */
	cookieObj: function (name, value) {
		var cookie = {name: name, value: value};
		return cookie;
	},
	
	/**
	 *	Assign a cookie to be deleted
	 */
	deleteCookieObj: function (name) {
		document.cookieChanges.deletes.push({name: name});
	},
	
	/**
	 * Erases a cookie
	 *
	 * name: The name of the cookie
	 */
	eraseCookie: function (name) {
		this.setCookie(name,"",-1);
	},
	
	/**
	 * Get the value of a cookie or returns an empty string if cookie
	 * doesn't exist.
	 *
	 * cname: The name of the cookie
	 */
	getCookie: function (cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return "";
	},

	/**
	 * Sets up global variables
	 */
	init: function () {
		if (document.requiredCookies === 'undefined') {
			document.requiredCookies = [];
		}
		
		this.checkRequiredCookies(document.requiredCookies);
		document.myCookieList = this.assignCookieObjList();
		document.cookieChanges = {
			adds: [],
			deletes: [],
			updates: []
		};
	},

	/**
	 * Closes cookie editor panel
	 * 
	 * replacing: True if a new panel is replacing the one being removed
	 */
	removePanel: function (replacing) {
		var panels = document.getElementsByClassName('cookiePanel');
		for (var i = 0; i < panels.length; i++) {
			panels[i].remove();
		}
		if (!replacing && this.getCookie('alwaysShowButton') === 'true') {
			this.showCookieButton();
		}
	},
	
	/**
	 * Processes assigned adds, deletes, and updates for cookies.
	 */
	save: function () {
		var adds = document.cookieChanges.adds;
		var deletes = document.cookieChanges.deletes;
		var updates = document.cookieChanges.updates;
		
		if (adds.length > 0 || updates.length > 0) {
			var cookieList = adds.concat(updates);
			for (var i = 0; i < cookieList.length; i++) {
				var cookie = cookieList[i];
				this.setCookie(cookie.name, cookie.value, 365);
			}
			document.cookieChanges.adds = [];
			document.cookieChanges.updates = [];
		}
		if (deletes.length > 0) {
			for (var i = 0; i < deletes.length; i++) {
				var cookie = deletes[i];
				this.eraseCookie(cookie.name);
			}
			document.cookieChanges.deletes = [];
		}
	},
	
	/**
	 * Creates a cookie
	 *
	 * cname: The name of the cookie
	 * cvalue: the value of the cookie
	 * exdays: the number of days until the cookie should expire
	 */
	setCookie: function (cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	},
	
	/**
	 * Makes sure the following cookies exist.  The given cookies 
	 * will not override existing cookie values.  These cookies cannot
	 * be deleted.
	 * 
	 * rCookies: Array of cookie objects 
	 * {name: cookie name, value: default value}
	 */
	setRequiredCookies: function (rCookies) {
		if (typeof(document.requiredCookies) === 'undefined' || document.requiredCookies === []) {
			document.requiredCookies = rCookies;
		} else {
			var currentCookies = document.requiredCookies;
			for (var j = 0; j < rCookies.length; j++) {
				var foundCookie = false;
				for (var i = 0; i < currentCookies.length; i++) {
					if (rCookies[j].name === currentCookies[i].name) {
						foundCookie = true;
						break;
					}
				}
				if (!foundCookie) {
					currentCookies.push(rCookies[j]);
				}
			}
			document.requiredCookies = currentCookies;
		}
	},

	/**
	 * Opens the cookie editor panel
	 */
	showCookieButton: function () {
		this.removePanel(true);

		menuobj = document.createElement('ul');
		menuobj.className = 'cookiePanel';
		menuobj.style.position = 'fixed';
		menuobj.style.zIndex = '1000';
		menuobj.style.top = '10px';
		menuobj.style.left = '10px';
		menuobj.style.padding = '20px';
		menuobj.style.backgroundColor = '#fff';
		menuobj.style.color = 'black';
		var panelText = "<li><button onclick='document.gibado.util.cookieEditor()' >Cookie Editor </button></li>";
		menuobj.innerHTML = panelText;
		body = document.getElementsByTagName('body')[0];
		body.appendChild(menuobj);
	},
	
	/**
	 * Last function call.  Includes setup info.
	 */
	startService: function () {
		var requiredCookies = [this.cookieObj('alwaysShowButton','true'), this.cookieObj('showEditorOnLoad','true')];
		this.setRequiredCookies(requiredCookies);
		// Created missing required cookies
		this.checkRequiredCookies(document.requiredCookies);
		
		var show = this.getCookie('showEditorOnLoad');
		if (show === 'true') {
			this.showCookieButton();
		}
	},
	
	/**
	 *	Assign a cookie to be updated
	 */
	updateCookie: function (name) {
		var cookie = {
			name: name.substring(6),
			value: document.getElementById(name).value
		};
		document.cookieChanges.updates.push(cookie);
	},
	
	/**
	 * Creates a visual indication that something happened.
	 */
	updateRow: function (button) {
		var name = button.textContent.toLowerCase();
		var tableRow = button.parentElement.parentElement;
		var classPath = "document.gibado.util.";
		if (name.indexOf('update') !== -1) {
			button.textContent += '*';
		} else if (name.indexOf('delete') !== -1) {
			tableRow.style.textDecoration='line-through';
			tableRow.getElementsByTagName('input')[0].disabled=true;
			var buttons = tableRow.getElementsByTagName('button');
			buttons[0].disabled=true;
			buttons[1].disabled=true;
		} else if (name.indexOf('add') !== -1) {
			// generate new row
			var name = document.getElementById('newNAME').value;
			var value = document.getElementById('newVALUE').value;
			var id = 'COOKIE'+name;
			var table = tableRow.parentElement;
			var newRow = table.insertRow(table.rows.length - 2);
			newRow.insertCell(0).innerHTML = name;
			newRow.insertCell(1).innerHTML = "<input type='text' id='" + name + "' value='" + value + "' />";
			newRow.insertCell(2).innerHTML = "<button onclick=\"" + classPath + "updateCookie('" + id + "\');" + classPath + "updateRow(this);\"\>Update</button>";
			newRow.insertCell(3).innerHTML = "<button onclick=\"" + classPath + "deleteCookieObj(\'" + name +"\');" + classPath + "updateRow(this);\"\>Delete</button>";
			
			// clear new cookie fields
			document.getElementById('newNAME').value = '';
			document.getElementById('newVALUE').value = '';
		}
	}
}

document.gibado.util.startService();