// ==UserScript==
// @name		Mint Offer Remover
// @namespace	https://github.com/Gibado
// @version		2019.9.4.3
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
     * Checks if offers exist on the page
     * @return {boolean} Returns true if offers exist on the page
     */
    document.gibado.Mint.offersExist = function() {
        return document.getElementsByClassName('offerSection').length > 0 &&
            document.getElementsByClassName('CardView adviceWidget').length > 0;
    };

    /**
     * Hides offers that are on the page
     */
    document.gibado.Mint.clearOffers = function() {
        var offer = document.getElementsByClassName('offerSection')[0];
        offer.hidden = true;
        offer = document.getElementsByClassName('CardView adviceWidget')[0];
        offer.hidden = true;
    };

    Utils.conditionalRun(2000, document.gibado.Mint.offersExist, document.gibado.Mint.clearOffers);
})();