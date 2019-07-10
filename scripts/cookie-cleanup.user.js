// ==UserScript==
// @name         cookie-cleanup.user.js
// @namespace    https://github.com/Gibado
// @version      2019.7.10
// @description  Adds a function to the site delete all ""gsScrollPos" cookies from that site.  This is is an issue with some Google sites.
// @author       Tyler Studanski
// @match        https://www.google.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Gibado/scripts/master/cookie-cleanup.user.js
// @downloadURL  https://raw.githubusercontent.com/Gibado/scripts/master/cookie-cleanup.user.js
// ==/UserScript==

// ==Version History==
// 2019.7.10 - Initial version
// ==/Version History==

(function() {
    'use strict';

    // Your code here...
    document.gibado = {
        deleteCookie : function(name) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        },
        verifyCookie : function(cookie) {
            return cookie.startsWith('gsScrollPos');
        },
        cleanCookies : function() {
            var cookies = document.cookie.split('; ');
            cookies = cookies.filter(document.gibado.verifyCookie);
            for (var i = 0; i < cookies.length; i++) {
                var cookieName = cookies[i].split('=')[0];
                document.gibado.deleteCookie(cookieName);
            }
        }
    };
})();