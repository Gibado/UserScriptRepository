// ==UserScript==
// @name		Mint Count Scraper
// @namespace	https://github.com/Gibado
// @version		2019.9.4.1
// @description	Collects account amounts for easy exporting
// @match		https://mint.intuit.com/overview.event
// @require		https://raw.githubusercontent.com/Gibado/UserScriptRepository/master/common/ClipboardUtils.js
// @require		https://raw.githubusercontent.com/Gibado/UserScriptRepository/master/common/Utils.js
// @require		https://raw.githubusercontent.com/Gibado/UserScriptRepository/master/common/MintCommon.js
// @downloadURL https://github.com/Gibado/UserScriptRepository/raw/master/scripts/MintCountScraper.user.js
// @updateURL   https://github.com/Gibado/UserScriptRepository/raw/master/scripts/MintCountScraper.user.js
// @copyright	2019
// @author		Tyler Studanski
// @grant		none
// ==/UserScript==

// ==Version History==
// 2019.9.4.1 - Removed 'this' references
// 2019.9.4.0 - Moved functions to common files.  Changed to a modular object build.  Updated documentation
// 2019.9.3.2 - Added timeout for initial work
// 2019.9.3.1 - Moved copy to clipboard to utility js file.  Changed code layout
// 2019.9.3.0 - Initial check-in
// ==/Version History==

(function() {
    'use strict';

    // Your code here...
    // Constructors
    if (document.gibado === undefined) {
        document.gibado = {};
    }

    if (document.gibado.Mint === undefined) {
        document.gibado.Mint = {};
    }

    /**
     * Map that holds all the totals
     */
    document.gibado.Mint.fundsMap = {};

    /**
     * Holds export String
     * @type {string}
     */
    document.gibado.Mint.report = '';

    /**
     * Grabs checking and savings account totals and stores them in the map
     */
    document.gibado.Mint.grabFunds = function() {
        document.gibado.Mint.fundsMap['funds'] = document.gibado.Mint.addAccountListToMap(document.getElementsByClassName('accounts-list')[0]);
    };

    /**
     * Grabs debt account totals and stores them in the map
     */
    document.gibado.Mint.grabDebts = function() {
        document.gibado.Mint.fundsMap['debts'] = document.gibado.Mint.addAccountListToMap(document.getElementsByClassName('accounts-list')[1]);
    };

    /**
     * Base work function
     */
    document.gibado.Mint.doWork = function () {
        document.gibado.Mint.grabFunds();
        document.gibado.Mint.grabDebts();
        document.gibado.Mint.buildReport();
    };

    /**
     * Updates the report String
     */
    document.gibado.Mint.buildReport = function() {
        document.gibado.Mint.report = '';
        var fundsOrder = ['SELECT BANKING', 'EVERYDAY CHECKING', 'SAVINGS'];
        var fundsName = ['Bremer', 'WF Checking', 'WF Savings'];
        var debtsOrder = ['XXX-XXXX-631', 'Kristi CC', 'Tyler CC', 'PLATINUM CARD', 'Target Credit Card', "XXXXXXXXXX1940"];
        var debtsName = ['Khols', 'SW CC Kristi', 'SW CC Tyler', 'WF CC Tyler', 'Target', "Sam's Club"];
        var i, key;
        for (i in fundsOrder) {
            key = fundsOrder[i];
            document.gibado.Mint.report += fundsName[i] + '\t' + document.gibado.Mint.fundsMap.funds[key] + '\n';
        }
        document.gibado.Mint.report += '\n';
        for (i in debtsOrder) {
            key = debtsOrder[i];
            document.gibado.Mint.report += debtsName[i] + '\t' + document.gibado.Mint.fundsMap.debts[key] + '\n';
        }
        Utils.copyTextToClipboard(document.gibado.Mint.report);
    };

    /**
     * Converts account balance from string to a number
     * @param balanceString String containing a financal amount
     * @returns {number} Financial number
     */
    document.gibado.Mint.cleanBalance = function(balanceString) {
        return parseFloat(balanceString.replaceAll(',','').replaceAll('$',''));
    };

    /**
     * Takes all the accounts in the accountList and adds them to a map
     * @param accountList List of accounts to add to a map
     * @returns {map} Map containing account information (name, balance)
     */
    document.gibado.Mint.addAccountListToMap = function(accountList) {
        var map = {};
        var accounts = accountList.children;
        for (var i = 0 ; i < accounts.length; i++) {
            var balance = document.gibado.Mint.cleanBalance(accounts[i].getElementsByClassName('balance')[0].textContent);
            var accountName = accounts[i].getElementsByClassName('accountName')[0].textContent;
            map[accountName] = balance;
        }
        return map;
    };


    Utils.conditionalRun(2000, document.gibado.Mint.isDoneLoading, document.gibado.Mint.doWork);
})();