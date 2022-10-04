// ==UserScript==
// @name         Mint Current Budget Numbers
// @namespace    https://github.com/Gibado
// @version      2022.10.4.0
// @description  Adds another budget summary with the current values rather than expected values
// @author       Tyler Studanski
// @match        https://mint.intuit.com/budgets
// @icon         https://www.google.com/s2/favicons?sz=64&domain=intuit.com
// @downloadURL  https://github.com/Gibado/UserScriptRepository/raw/master/scripts/MintCurrentBudgetNumbers.user.js
// @updateURL    https://github.com/Gibado/UserScriptRepository/raw/master/scripts/MintCurrentBudgetNumbers.user.js
// @grant        none
// @copyright	 2022
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function MintModel() {
        var self = this;

        self.checkInterval = 100; // milliseconds

        self.addCurrentBudgetTotals = function() {
            var totals = self.getTotals();
            totals.leftOver = totals.correctIncome-totals.correctSpending

            // Display results
            var copy = document.getElementsByClassName('GFnUV')[0].cloneNode(true);
            var parent = document.getElementsByClassName('hnoTcK')[0];

            copy.getElementsByClassName('emqdbU')[0].textContent = 'Current budget';
            copy.getElementsByClassName('kWUvkg')[0].textContent = self.numberToMoney(totals.correctIncome);
            copy.getElementsByClassName('jwiEqi')[0].textContent = self.numberToMoney(totals.correctSpending);
            copy.getElementsByClassName('jpsRWg')[0].textContent = self.numberToMoney(totals.leftOver);

            parent.append(copy);
        }

        self.getTotals = function() {
            // Find totals
            var existingTotals = document.getElementsByClassName('ghkQbW')
            var currentIncome = existingTotals[0].textContent;
            var currentExpense = existingTotals[1].textContent;

            currentIncome = self.moneyToNumber(currentIncome.substring(0,currentIncome.indexOf(' of')));
            currentExpense = self.moneyToNumber(currentExpense.substring(0,currentExpense.indexOf(' of')));

            // Correct totals
            var lineValues = document.getElementsByClassName('gqWsLq');
            var otherIncome = '';
            var otherSpending = '';

            for (var i = 0; i < lineValues.length; i++) {
                if (lineValues[i].textContent.indexOf('Other income') > -1) {
                    otherIncome = lineValues[i].textContent;
                    otherIncome = self.moneyToNumber(otherIncome.substring(otherIncome.indexOf('$')));
                } else if (lineValues[i].textContent.indexOf('Other spending') > -1) {
                    otherSpending = lineValues[i].textContent;
                    otherSpending = self.moneyToNumber(otherSpending.substring(otherSpending.indexOf('$')));
                }
            }

            return {
                income: currentIncome,
                expense: currentExpense,
                otherIncome: otherIncome,
                otherSpending: otherSpending,
                correctIncome: currentIncome+otherIncome,
                correctSpending: currentExpense+otherSpending
            };
        }

        self.moneyToNumber = function(string) {
            return parseInt(string.replace('$','').replace(',',''));
        };

        self.numberToMoney = function(num) {
            var result = '$';
            var str = num.toString();
            var extra = str.length % 3;
            result += str.substring(0, extra);
            var remaining = str.substring(extra);
            while (remaining.length > 0) {
                if (result.length > 1) {
                    result += ',';
                }
                result += remaining.substring(0, 3);
                remaining = remaining.substring(3);
            }
            return result;
        };

        self.loadWhenReady = function() {
            // Verify all elements are available
            if (self.isReady()) {
                // If ready then display info
                self.addCurrentBudgetTotals();
            } else {
                // If not then trigger this check again
                setTimeout(self.loadWhenReady, self.checkInterval);
            }
        };

        self.isReady = function() {
            console.log('Checking if elements are available.');
            return document.getElementsByClassName('ghkQbW').length > 0 && document.getElementsByClassName('gqWsLq').length > 0;
        };

        return self;
    }

    document.MintModel = MintModel;
    document.mintModel = document.MintModel();
    document.mintModel.loadWhenReady();
})();
