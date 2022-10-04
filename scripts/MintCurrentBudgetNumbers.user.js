// ==UserScript==
// @name         Mint Current Budget Numbers
// @namespace    https://github.com/Gibado
// @version      2022.10.4.3
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
        self.greenClass = 'jpsRWg';
        self.redClass = 'jwiEqi';
        self.blackClass = 'kWUvkg';

        self.updateCurrentBudgetTotals = function() {
            var totals = self.getTotals();
            totals.leftOver = totals.correctIncome-totals.correctSpending

            // Display results
            self.getDisplayElement();
            document.getElementById('income').textContent = self.numberToMoney(totals.correctIncome);
            document.getElementById('expense').textContent = self.numberToMoney(totals.correctSpending);
            var leftover = document.getElementById('leftOver');
            leftover.textContent = self.numberToMoney(totals.leftOver);

            // Update leftover color
            self.updateTextColor(leftover, totals.leftOver);
        }

        self.updateTextColor = function(div, quantity) {
            // Remove existing colors
            div.classList.remove(self.greenClass);
            div.classList.remove(self.redClass);
            div.classList.remove(self.blackClass);

            // Assign correct color
            if (quantity > 0) {
                div.classList.add(self.greenClass);
            } else if (quantity < 0) {
                div.classList.add(self.redClass);
            } else {
                div.classList.add(self.blackClass);
            }
        };

        self.getDisplayElement = function() {
            var display = document.getElementById('currentBudgetSummary');
            if (display === null) {
                // Need to create display
                display = document.getElementsByClassName('GFnUV')[0].cloneNode(true);
                var parent = document.getElementsByClassName('hnoTcK')[0];
                parent.append(display);
                display.id = 'currentBudgetSummary';
                display.children[0].getElementsByTagName('span')[0].textContent = 'Current budget';
                display.children[1].getElementsByTagName('div')[1].id = 'income';
                display.children[2].getElementsByTagName('div')[1].id = 'expense';
                display.children[display.children.length-1].getElementsByTagName('div')[1].id = 'leftOver';
            }
            return display;
        };

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
                self.run();
            } else {
                // If not then trigger this check again
                setTimeout(self.loadWhenReady, self.checkInterval);
            }
        };

        self.isReady = function() {
            console.log('Checking if elements are available.');
            return document.getElementsByClassName('ghkQbW').length > 0 && document.getElementsByClassName('gqWsLq').length > 0;
        };

        // Actions to execute when the page is ready
        self.run = function() {
            document.getElementsByClassName('ehuaet')[0].onclick = function() {
                setTimeout(self.updateCurrentBudgetTotals, 300);
            };
            self.updateCurrentBudgetTotals();
        };

        return self;
    }

    document.MintModel = MintModel;
    document.mintModel = document.MintModel();
    document.mintModel.loadWhenReady();
})();
