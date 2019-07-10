// ==UserScript==
// @name         cookie-cleanup.user.js
// @namespace    https://github.com/Gibado
// @version      2019.7.10.3
// @description  Adds a function to the site delete all ""gsScrollPos" cookies from that site.  This is is an issue with some Google sites.
// @author       Tyler Studanski
// @match        https://www.google.com/*
// @match        https://www.youtube.com/*
// @grant        none
// @updateURL    https://github.com/Gibado/UserScriptRepository/raw/master/scripts/cookie-cleanup.user.js
// @downloadURL  https://github.com/Gibado/UserScriptRepository/raw/master/scripts/cookie-cleanup.user.js
// ==/UserScript==

// ==Version History==
// 2019.7.10.3 - Added YouTube to matching site list
// 2019.7.10.2 - Fix update URL
// 2019.7.10.1 - Simplify code and added comments
// 2019.7.10 - Initial version
// ==/Version History==

(function() {
    'use strict';

    // Your code here...
    document.gibado = {
        deleteCookie : function(name) {
            // Sets the cookie expiration to a past time
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        },
        verifyCookie : function(cookie) {
            // Filter function to find problem gsScrollPos cookies
            return cookie.startsWith('gsScrollPos');
        },
        cleanCookies : function() {
            // Get all cookies and filter to only problem cookies
            var cookies = document.cookie.split('; ').filter(document.gibado.verifyCookie);
            // Delete each cookie
            for (var i = 0; i < cookies.length; i++) {
                document.gibado.deleteCookie(cookies[i].split('=')[0]);
            }
        }
    };
})();