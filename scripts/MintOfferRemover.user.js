// ==UserScript==
// @name		Mint Offer Remover
// @namespace	https://github.com/Gibado
// @version		2019.9.4.5
// @description	Removes the offers on the page
// @match		https://mint.intuit.com/overview.event
// @require		https://raw.githubusercontent.com/Gibado/UserScriptRepository/master/common/Utils.js
// @downloadURL https://github.com/Gibado/UserScriptRepository/raw/master/scripts/MintOfferRemover.user.js
// @updateURL   https://github.com/Gibado/UserScriptRepository/raw/master/scripts/MintOfferRemover.user.js
// @copyright	2019
// @author		Tyler Studanski
// @grant		none
// ==/UserScript==

// ==Version History==
// 2019.9.4.5 - Will also remove offers from other tabs
// 2019.9.4.4 - Split out offers and advice
// 2019.9.4.3 - Added documentation
// 2019.9.4.2 - Changed conditional function
// 2019.9.4.1 - Added Utils and common Mint functions
// 2019.9.4.0 - Initial check-in
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
     * Checks if offers exists on the page
     * @return {boolean} Returns true if offers exists on the page
     */
    document.gibado.Mint.offersExists = function() {
        return document.getElementsByClassName('offerSection').length > 0;
    };

    /**
     * Checks if advice exists on the page
     * @return {boolean} Returns true if advice exists on the page
     */
    document.gibado.Mint.adviceExists = function() {
        return document.getElementsByClassName('CardView adviceWidget').length > 0;
    };

    /**
     * Hides all elements in the given list of elements
     * @param elementsList Array of HTML elements
     */
    document.gibado.Mint.hideElements = function(elementsList) {
        for (var i = 0; i < elementsList.length; i++) {
            elementsList[i].hidden = true;
        }
    };

    /**
     * Hides offers that are on the page
     */
    document.gibado.Mint.clearOffers = function() {
        document.gibado.Mint.hideElements(document.getElementsByClassName('offerSection'));
    };

    /**
     * Hides advice on the page
     */
    document.gibado.Mint.clearAdvice = function() {
        document.gibado.Mint.hideElements(document.getElementsByClassName('CardView adviceWidget'));
    };

    Utils.conditionalRun(2000, document.gibado.Mint.offersExists, document.gibado.Mint.clearOffers);
    Utils.conditionalRun(2000, document.gibado.Mint.adviceExists, document.gibado.Mint.clearAdvice);
})();