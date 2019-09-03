// ==UserScript==
// @name		Mint Count Scraper
// @namespace	https://github.com/Gibado
// @version		2019.9.3.2
// @description	Collects account amounts for easy exporting
// @match		https://mint.intuit.com/overview.event
// @require		https://raw.githubusercontent.com/Gibado/UserScriptRepository/master/common/ClipboardUtils.js
// @downloadURL https://github.com/Gibado/UserScriptRepository/raw/master/scripts/MintCountScraper.user.js
// @updateURL   https://github.com/Gibado/UserScriptRepository/raw/master/scripts/MintCountScraper.user.js
// @copyright	2019
// @author		Tyler Studanski
// @grant		none
// ==/UserScript==

// ==Version History==
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

    document.gibado.Mint = {
        /**
         * Map that holds all the totals
         */
        fundsMap: {},

        report: '',

        /**
         * Grabs checking and savings account totals and stores them in the map
         */
        grabFunds: function() {
            this.fundsMap['funds'] = this.addAccountListToMap(document.getElementsByClassName('accounts-list')[0]);
        },

        /**
         * Grabs debt account totals and stores them in the map
         */
        grabDebts: function() {
            this.fundsMap['debts'] = this.addAccountListToMap(document.getElementsByClassName('accounts-list')[1]);
        },

        doWork: function () {
            this.grabFunds();
            this.grabDebts();
            this.buildReport();
        },

        isDoneLoading: function() {
            return !document.getElementsByClassName('status connecting').length > 0;
        },

        triggerRetryWork: function() {
            setTimeout(function() {
                if (document.gibado.Mint.isDoneLoading()) {
                    document.gibado.Mint.doWork();
                } else {
                    document.gibado.Mint.triggerRetryWork();
                }
            }, 2000);
        },

        buildReport: function() {
            this.report = '';
            var fundsOrder = ['SELECT BANKING', 'EVERYDAY CHECKING', 'SAVINGS'];
            var fundsName = ['Bremer', 'WF Checking', 'WF Savings'];
            var debtsOrder = ['XXX-XXXX-631', 'Kristi CC', 'Tyler CC', 'PLATINUM CARD', 'Target Credit Card', "XXXXXXXXXX1940"];
            var debtsName = ['Khols', 'SW CC Kristi', 'SW CC Tyler', 'WF CC Tyler', 'Target', "Sam's Club"];

            for (var i in fundsOrder) {
                var key = fundsOrder[i];
                this.report += fundsName[i] + '\t' + this.fundsMap.funds[key] + '\n';
            }
            this.report += '\n';
            for (var i in debtsOrder) {
                var key = debtsOrder[i];
                this.report += debtsName[i] + '\t' + this.fundsMap.debts[key] + '\n';
            }
            Utils.copyTextToClipboard(this.report);
        },

        /**
         *
         * @param balanceString
         * @returns {number}
         */
        cleanBalance: function(balanceString) {
            return parseFloat(balanceString.replaceAll(',','').replaceAll('$',''));
        },

        /**
         *
         * @param accountList
         */
        addAccountListToMap: function(accountList) {
            var map = {};
            var accounts = accountList.children;
            for (var i = 0 ; i < accounts.length; i++) {
                var balance = this.cleanBalance(accounts[i].getElementsByClassName('balance')[0].textContent);
                var accountName = accounts[i].getElementsByClassName('accountName')[0].textContent;
                map[accountName] = balance;
            }
            return map;
        }
    };

    setTimeout(function() {
        document.gibado.Mint.triggerRetryWork();
    }, 2000);
})();