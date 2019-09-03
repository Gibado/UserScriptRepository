// ==UserScript==
// @name		Mint Count Scraper
// @namespace	https://github.com/Gibado
// @version		2019.9.3.0
// @description	Collects account amounts for easy exporting
// @match		https://mint.intuit.com/overview.event
// @downloadURL https://github.com/Gibado/UserScriptRepository/raw/master/scripts/MintCountScraper.user.js
// @updateURL   https://github.com/Gibado/UserScriptRepository/raw/master/scripts/MintCountScraper.user.js
// @copyright	2019
// @author		Tyler Studanski
// @grant		none
// ==/UserScript==

// ==Version History==
// 2019.9.3.0 - Initial check-in
// ==/Version History==

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
        this.copyTextToClipboard(this.report);
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
    },

    copyTextToClipboard: function (text) {
        var textArea = document.createElement("textarea");

        //
        // *** This styling is an extra step which is likely not required. ***
        //
        // Why is it here? To ensure:
        // 1. the element is able to have focus and selection.
        // 2. if element was to flash render it has minimal visual impact.
        // 3. less flakyness with selection and copying which **might** occur if
        //    the textarea element is not visible.
        //
        // The likelihood is the element won't even render, not even a
        // flash, so some of these are just precautions. However in
        // Internet Explorer the element is visible whilst the popup
        // box asking the user for permission for the web page to
        // copy to the clipboard.
        //

        // Place in top-left corner of screen regardless of scroll position.
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = 0;

        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';

        // Avoid flash of white box if rendered for any reason.
        textArea.style.background = 'transparent';


        textArea.value = text;

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }

        document.body.removeChild(textArea);
    }
};

$(document).ready(function(){
    document.gibado.Mint.triggerRetryWork();
});

