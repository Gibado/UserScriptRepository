// ==UserScript==
// @name        Facebook Comment Counter
// @author      Tyler Studanski
// @copyright   2019
// @namespace   https://github.com/Gibado
// @description Adds a button to list who commented on the posts on the page and how many times they did so.
// @version     2019.7.10.0
// @downloadURL http://gibado.ddns.net/UserScripts/Kristi/FacebookCounter.user.js
// @grant       none
// @match		https://www.facebook.com/events/*
// ==/UserScript==

// ==Version History==
// 2019.7.10.0 - Moved to GitHub.com
// v1.0 - First working version.
// v2.0 - Added UI for easier use
// v2.1 - Added specialPhrase functionality
// v2.2 - Changed so that it only counts 1 comment per person per post
// ==/Version History==

// TODO:
// 		[] Find a way to load all posts for the event/group.

/**
 *	Last Updated: 11/08/2015
 *
 *  Identifies which books are out of stock when making a wishlist
 *
 *	Future:
 *		1. [] Auto populate the page with all posts for the given event
 *		2. [] Add cookie support for specialPhrase
 */

if (typeof(document.gibado)==='undefined') {
	document.gibado = {};
}

document.gibado.facebook = {

	// A list of all the posts and any details related to them on the page
	dataList: [],

	// A list of home many times each person has commented
	masterCounts: [],

	//Special phrase to look for
	specialPhrase: "",

	// Custom list for managing a list of name-count pairs.
	// names are unique in list
	myListObject: function() {
		// data model
		this.array = [],

		// Adds the given count to the given name
		this.add = function (name, count) {
			var added = false;
			for (var k = 0; k < this.array.length; k++) {
				var currentName = this.array[k]
				if (currentName.name === name) {
					currentName.count += count;
					added=true;
					break;
				}
			}
			if (!added) {
				this.array.push({name: name, count: count});
			}
		},

		this.contains = function (name) {
			var exists = false;
			for (var i = 0; i < this.array.length; i++) {
				if (name === this.array[i].name) {
					exists = true;
					break;
				}
			}
			return exists;
		},

		// Pretty print for debugging purposes
		this.toString = function () {
			var string = "[";
			for (var k = 0; k < this.array.length; k++) {
				if (k !== 0) {
					string += ", "
				}

				var currentName = this.array[k]
				string += currentName.name + ":" + currentName.count;
			}
			string += "]"
			return string;
		}
	},

	// Creates a standard dataObject for each book
	dataObject: function (id, item, special) {
		return {id: id, item: item, commentList: [], special: special};
	},

	// Expands all compacted comments currently displayed on the page
	// TODO: Cause page to load all posts
	preparePage: function () {
		// Expand all compacted comments
		var comments = document.getElementsByClassName('UFIPagerLink');
		// Expand all compacted posts
		var postTexts = document.getElementsByClassName('see_more_link');

		for (var i = 0; i < comments.length; i++) {
			comments[i].click();
		}
		for (var i = 0; i < postTexts.length; i++) {
			postTexts[i].click();
		}
	},

	// Populates the dataList
	gatherData: function () {
		this.dataList = [];
		var postList = document.getElementsByClassName('userContentWrapper');

		for (var i = 0; i < postList.length; i++) {
			var post = postList[i];

			// Check for specialPhrase
			var special = false;
			if (this.specialPhrase !== "") {
				var postText = post.getElementsByTagName("p");
				for (var j = 0; j < postText.length; j++) {
					special = postText[j].innerText.contains(this.specialPhrase);
					if (special) {
						break;
					}
				}
			} else {
				// if specialPhrase is not defined then assume all posts
				// are special
				special = true;
			}

			var data = this.dataObject(i, post, special);

			var commentors = post.getElementsByClassName('UFICommentContent');

			var nameList = new this.myListObject();
			for (var j = 0; j < commentors.length; j++) {
				var name = commentors[j].getElementsByTagName('span')[0].innerText;
				// Only count 1 comment per person, per post
				if (!nameList.contains(name)) {
					nameList.add(name, 1);
				}
			}

			data.commentList = nameList.array;
			this.dataList.push(data);
		}
	},

	// Merges commentor counts from all posts into the masterCounts object
	gatherTotalCounts: function () {
		var nameCounts = new this.myListObject();
		for (var i = 0; i < this.dataList.length; i++) {
			if (this.dataList[i].special) {
				var currentList = this.dataList[i].commentList;
				for (var j = 0; j < currentList.length; j++) {
					var currentName = currentList[j];
					nameCounts.add(currentName.name, currentName.count);
				}
			}
		}
		this.masterCounts = nameCounts;
	},

	// The driving method.  Call this to start everything.
	runProcess: function () {
		this.preparePage();
		this.gatherData();
		this.gatherTotalCounts();
	}
};

document.gibado.facebook.UI = {
	// Final ID for panel
	panelId: 'countPanel',

	// A reference to the panel object
	panelObject: null,

	closeButtonText: "<button onclick='document.gibado.facebook.UI.closePanel()' >Close</button>",

	phraseFieldText: function () {
		var phrase = document.gibado.facebook.specialPhrase;
		return "Special Phrase: <input type='text' name='specialPhrase' value=\"" + phrase + "\" />";
	},

	// Builds the UI div
	createPanel: function () {
		menuobj = document.createElement('div');
		menuobj.className = this.panelId;
		menuobj.style.position = 'fixed';
		menuobj.style.zIndex = '1000';
		menuobj.style.top = '10px';
		menuobj.style.left = '10px';
		menuobj.style.padding = '20px';
		menuobj.style.backgroundColor = '#fff';
		menuobj.style.color = 'black';
		var panelText = "<p>Add html here</p>";
		menuobj.innerHTML = panelText;
		this.panelObject = menuobj;
	},

	updateSpecialPhrase: function () {
		document.gibado.facebook.specialPhrase = document.getElementsByName("specialPhrase")[0].value;
	},

	addPanelToScreen: function () {
		body = document.getElementsByTagName('body')[0];
		body.appendChild(this.panelObject);
	},

	// Closes the UI
	closePanel: function () {
		var panels = document.getElementsByClassName(this.panelId);
		for (var i = 0; i < panels.length; i++) {
			panels[i].remove();
		}
	},

	/**
	 * Opens the cookie editor panel
	 */
	showStartupButton: function () {
		var panelText = "<ul><li><button onclick='document.gibado.facebook.UI.countUI()' >Gather Comment Counts</button></li>";

		// Special Phrase Field
		panelText += "<li>" + this.phraseFieldText() + "</li>";

		// Close Button
		panelText += "<li>" + this.closeButtonText + "</li>";
		panelText += "</ul>";

		this.panelObject.innerHTML = panelText;
	},

	countUI: function () {
		this.updateSpecialPhrase();
		var model = document.gibado.facebook;
		model.runProcess();
		var results = model.masterCounts.array;
		var panelText = "<ul>";

		for (var i = 0; i < results.length; i++) {
			panelText += "<li>" + results[i].count + " : " + results[i].name + "</li>";
		}

		// Recount button
		panelText += "<li><button onclick='document.gibado.facebook.UI.countUI()' >Regather Counts</button></li>";

		// Special Phrase Field
		panelText += "<li>" + this.phraseFieldText() + "</li>";

		// Add close button
		panelText += "<li>" + this.closeButtonText + "</li>";
		panelText += "</ul>";

		// Add note
		panelText += "<p>(Scroll to bottom of page to<br>gather counts from all posts)</p>";
		this.panelObject.innerHTML = panelText;
	},

	startup: function () {
		this.closePanel();
		this.createPanel();
		this.showStartupButton();
		this.addPanelToScreen();
	}
};

document.gibado.facebook.UI.startup();