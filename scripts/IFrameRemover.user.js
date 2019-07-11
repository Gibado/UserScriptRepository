// ==UserScript==
// @name         iFrame Remover
// @namespace    https://github.com/Gibado
// @copyright    2019
// @version      2019.7.10.0
// @description  Adds the function cleanUpFrames to document that will remove all iframes from the page when called.
// @author       Tyler Studanski
// @match        *
// @grant        none
// @downloadURL  https://github.com/Gibado/UserScriptRepository/raw/master/scripts/IFrameRemover.user.js
// @updateURL    https://github.com/Gibado/UserScriptRepository/raw/master/scripts/IFrameRemover.user.js
// ==/UserScript==

// ==Version History==
// 2019.7.10.0 - Moved to GitHub.com
// ==/Version History==

(function() {
    'use strict';

    // Your code here...
    document.cleanUpFrames = function () {
        var myFrames = document.getElementsByTagName('iframe');
        var count = 0;
        while (myFrames.length > 0) {
            myFrames[0].remove();
            count++;
            myFrames = document.getElementsByTagName('iframe');
        }
        return count;
    };
})();