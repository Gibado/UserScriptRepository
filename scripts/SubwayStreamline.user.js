// ==UserScript==
// @name		Subway Streamline
// @namespace	https://github.com/Gibado
// @version		2019.7.10.0
// @description	Streamlines through the free cookie survey
// @match		https://www.tellsubway.com/ContentManager/Controller.aspx?page=Home/Home
// @match		https://www.tellsubway.com/ContentManager/Controller.aspx?page=CustomerExperience/SurveyNew*
// @match		https://gibado.ddns.net/scripts/utilities/CookieUtils.js
// @require		http://gibado.ddns.net/scripts/utilities/CookieUtils.js
// @downloadURL http://gibado.ddns.net/UserScripts/Personal/SubwayStreamline.user.js
// @copyright	2015
// @author		Tyler Studanski
// @grant		none
// ==/UserScript==

// ==Version History==
// 2019.7.10.0 - Moved to GitHub.com
// v2.9 - Fixed Bug #7.
//		- Changed arrays to functions
//		- Added hiding functionality
// v2.8 - Updated to handle new question wording
// v2.7 - Fixed Bug #6.  It was an issue with method reference.
// v2.6 - Removed possibly troubling characters
//		- Fixed Bug #4 and Bug #5
// v2.5 - Refactoring to a follow a more object based setup
//		- Added Author tag
// v2.4 - Updated copyright year
// v2.3 - Fixed issue with require header
// v2.2 - Enhanced with new version of Cookie Util
//		- changed to using require header
// v2.1 - Added grant header
// v2.0 - Now uses Cookie Util functionality.
// v1.9 - Added code to prepare for Cookie Util functionality to make this more generic.
// v1.8 - Overhauled the question answering method to be more generic.  This fixed Bug #3.
// v1.7 - Fixed Bug #2 by making the element selector more generic.  Started work on Bug #3.
// v1.6 - Fixed Bug #1 by correcting isCookieLoaderPresent method and split up code for easier management
// v1.5 - Added in check to handle slow page load.
// ==/Version History==

// ==Future Improvements==
// #1 Hide survey questions from view so you don't have to scroll to click submit button.
// ==/Future Improvements==

var Util = document.gibado.util;

document.gibado.Subway = {
	Finals: {
		EMAIL: 'email',
		STORE_NUMBER: 'storeNumber',
		HIDE_OPTIONS: 'hideOptions'
	},

	hardQs: function () {
		return [
		{
			text:'How did you pay for your order?',
			answer: 'Credit Card or Subway',
			hide: false
		},
		{
			text: 'To what email address should we send your unique code for a free cookie?',
			answer: Util.getCookie(this.Finals.EMAIL),
			hide: false
		}
		];
	},

	easyQs: function () {
		return [
		{
			text:' restaurant have all menu items and sandwich toppings available that you wished to order?',
			answer: 'Yes',
			hide: true
		},
		{
			text:'Is there a compliment you would like to pass on to the team of this restaurant today?',
			answer: 'No',
			hide: true
		},
		{
			text:'Is there an issue or concern you would like to pass on to the team of this restaurant today?',
			answer: 'No',
			hide: true
		},
		{
			text:'How many times per month do you visit a fast-food restaurant?',
			answer: '4',
			hide: true
		},
		{
			text:'Of those visits, how many times per month are at SUBWAY',
			answer: '2',
			hide: true
		},
		{
			text:'Please send me VALUABLE offers and news from SUBWAY',
			answer: 'No',
			hide: true
		},
		{
			text: 'contact you by email',
			answer: 'No',
			hide: true
		}
		];
	},

	handleFrontPage: function () {
		if ($('input#txtSearch').length === 1) {
			$('input#txtSearch')[0].value = Util.getCookie(this.Finals.STORE_NUMBER);
		}
		if ($('div.TS_btn1[onclick]').length === 1) {
			$('div.TS_btn1[onclick]')[0].click();
		}
	},

	setRatings: function () {
		var buttons = this.groupRadioButtons();
		var myButtons = [];
		for (var j = 0; j < buttons.keys.length; j++) {
			if (buttons[buttons.keys[j]].length === 11) {
				buttons[buttons.keys[j]][10].click();
			}
		}
	},

	getRankTables: function () {
		var groupMap = this.groupRadioButtons();
		var tables = [];
		for (var j = 0; j < groupMap.keys.length; j++) {
			if (groupMap[groupMap.keys[j]].length === 11) {
				var myRadio = groupMap[groupMap.keys[j]][0];
				// Going up until we hit the table
				var table = myRadio.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
				tables.push(table);
			}
		}
		return tables;
	},

	answerQuestions: function () {
		var questions = this.getMyQuestions(this.getAllQuestionList());
		for (var i = 0; i < questions.length; i++) {
			var question = null;
			if (questions[i].getElementsByTagName('select').length > 0) {
				question = questions[i].getElementsByTagName('select')[0];
			}

			if (question !== null) {
				var k = 0;
				for (; k < question.options.length; k++) {
					if (question.options[k].text.indexOf(questions[i].details.answer) !== -1) {
						question.selectedIndex = k;
						if (question.onchange !== null) {
							question.onchange();
						}
						break;
					}
				}
			} else {
				questions[i].getElementsByTagName('input')[0].value=questions[i].details.answer;
			}
		}
	},

	groupRadioButtons: function () {
		var inputs = $("input[type='radio']");
		var groupMap = {
			length: 0,
			keys: []
		};
		for (var i = 0; i < inputs.length; i++) {
			var input = inputs[i];
			if (input.name in groupMap) {
				groupMap[input.name].push(input);
			} else {
				groupMap[input.name] = [input];
				groupMap.length++;
				groupMap.keys.push(input.name);
			}
		}
		return groupMap;
	},

	getQuestions: function () {
		var tables = $('table.tableStyle');
		var questions = [];
		for (var i = 0; i < tables.length; i++) {
			if (tables[i].getElementsByTagName('tr').length === 2) {
				questions.push(tables[i]);
			}
		}
		return questions;
	},

	getAllQuestionList: function () {
		return this.hardQs().concat(this.easyQs());
	},

	getMyQuestions: function (qText) {
		var tables = this.getQuestions();
		var myQuestions = [];
		for (var i = 0; i < tables.length; i++) {
			for (var j = 0; j < qText.length; j++) {
				if (tables[i].textContent.indexOf(qText[j].text) !== -1) {
					tables[i].details = qText[j];
					myQuestions.push(tables[i]);
					break;
				}
			}
		}
		return myQuestions;
	},

	hideOptions: function () {
		var hide = Util.getCookie(this.Finals.HIDE_OPTIONS).toLowerCase() === 'true';

		if (!hide) {
			return;
		}

		var questionList = this.getMyQuestions(this.getAllQuestionList());
		for (var i = 0; i < questionList.length; i++) {
			if (questionList[i].details.hide) {
				questionList[i].style.display = 'none';
			}
		}
		var ranks = this.getRankTables();
		for (i = 0; i < ranks.length; i++) {
			ranks[i].style.display = 'none';
		}
	},

	isCookieLoaderPresent: function () {
		var found = false;
		if ($('#myDiv').length > 0) {
			var images = $('#myDiv')[0].getElementsByTagName('img');
			if (images.length > 0) {
				if (images[0].src.indexOf('CookieLoader.gif') > 0) {
					found = true;
				}
			}
		}
		return found;
	},

	doWork: function () {
		Util.setRequiredCookies([Util.cookieObj(this.Finals.EMAIL,'you@email.com')]);
		Util.setRequiredCookies([Util.cookieObj(this.Finals.STORE_NUMBER,'51729')]);
		Util.setRequiredCookies([Util.cookieObj(this.Finals.HIDE_OPTIONS,'false')]);
		if (this.isCookieLoaderPresent()) {
			setTimeout(function() {
				document.gibado.Subway.doWork();
			}, 2000);
		} else {
			if ($('input#txtSearch').length === 1) {
				this.handleFrontPage();
			}

			var paymethod = $('select#answ7379');
			paymethod.val('34376');
			paymethod.change();
			this.setRatings();
			this.answerQuestions();
			this.hideOptions();
		}
	}
};

$(document).ready(function(){
    setTimeout(function() {
    	document.gibado.Subway.doWork();
    }, 2000);
});