// ==UserScript==
// @name         Optavia Box Count
// @namespace    https://github.com/Gibado
// @version      2021.8.31.0
// @description  Gets and displays the box count on the subscription and cart page
// @author       Tyler Studanski
// @match        https://www.optavia.com/my-account/subscriptions
// @match        https://www.optavia.com/cart
// @icon         https://www.google.com/s2/favicons?domain=optavia.com
// @downloadURL  https://github.com/Gibado/UserScriptRepository/raw/master/scripts/OptaviaBoxCount.user.js
// @updateURL    https://github.com/Gibado/UserScriptRepository/raw/master/scripts/OptaviaBoxCount.user.js
// @copyright	 2021
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // Gets and displays the box count on the subscription page
    document.OptaviaBoxCount = function() {
        // TODO: Additional features needed
        // 1. Auto update the total on value change in the cart
        this.self = this;
        // Finds box total on subscription page
        self.getSubscriptionBoxCount = function() {
            var counts = $('.productValues[data-header="Qty"]').toArray();
            var total = 0;
            counts.forEach(function(item){
                total += parseInt(item.textContent);
            });
            return total;
        }
        // Finds box total on cart page
        self.getCartBoxCount = function() {
            var counts = $('input[name="quantity"]').toArray();
            var total = 0;
            counts.forEach(function(item){
                total += parseInt(item.value);
            });
            return total;
        }
        // Adds box total to the page
        self.addBoxTotal = function(boxTotal) {
            // Modified from https://www.w3schools.com/jsref/met_table_insertrow.asp
            var table = document.getElementById("orderTotals");
            var row = table.insertRow(0);
            row.classList.add('boxTotal');
            var cell1 = row.insertCell(0);
            cell1.classList.add('boxLabel');
            var cell2 = row.insertCell(1);
            cell2.classList.add('boxAmt');

            // Add some text to the new cells:
            cell1.innerHTML = "Total Box Count:";
            cell2.innerHTML = boxTotal;
        }
        // Updates box total line
        self.updateBoxTotal = function(boxTotal) {
            var boxAmt = $('.boxAmt')[0];
            boxAmt.innerHTML = boxTotal;
        }
        // Initiates the magic
        self.run = function() {
            // Find the correct box total
            var boxTotal = -1;
            var location = document.location.href;
            if (location.indexOf('cart') > 0) {
                boxTotal = self.getCartBoxCount();
            } else if (location.indexOf('subscriptions') > 0) {
                boxTotal = self.getSubscriptionBoxCount();
            }

            // update or add total to the page
            if ($('.boxTotal').length == 0) {
                self.addBoxTotal(boxTotal);
            } else {
                self.updateBoxTotal(boxTotal);
            }
        }

        return self;
    }

    var optaviaBoxCount = document.OptaviaBoxCount();
    optaviaBoxCount.run();
})();
