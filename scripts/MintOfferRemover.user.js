// ==UserScript==
// @name		Mint Offer Remover
// @namespace	https://github.com/Gibado
// @version		2019.9.4.0
// @description	Removes the offers on the page
// @match		https://mint.intuit.com/overview.event
// @downloadURL https://github.com/Gibado/UserScriptRepository/raw/master/scripts/MintOfferRemover.user.js
// @updateURL   https://github.com/Gibado/UserScriptRepository/raw/master/scripts/MintOfferRemover.user.js
// @copyright	2019
// @author		Tyler Studanski
// @grant		none
// ==/UserScript==

// ==Version History==
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

    document.gibado.Mint.clearOffers = function() {
        var offer = document.getElementsByClassName('offerSection')[0];
        offer.hidden = true;
        offer = document.getElementsByClassName('CardView adviceWidget')[0];
        offer.hidden = true;
    };

    setTimeout(function() {
        document.gibado.Mint.clearOffers();
    }, 2000);
})();