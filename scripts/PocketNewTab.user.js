// ==UserScript==
// @name         Pocket New Tab
// @namespace    https://github.com/tstudanski/
// @version      2024.05.29.0
// @description  Makes the "View Original" link open in a new tab
// @author       Tyler Studanski
// @match        https://getpocket.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getpocket.com
// @downloadURL  https://github.com/Gibado/UserScriptRepository/raw/master/scripts/PocketNewTab.user.js
// @updateURL    https://github.com/Gibado/UserScriptRepository/raw/master/scripts/PocketNewTab.user.js
// @require      https://github.com/tstudanski/UserScripts/raw/main/common/ChangeModule.js
// @require      https://github.com/tstudanski/UserScripts/raw/main/common/PageChangeModule.js
// @grant        none
// ==/UserScript==

'use strict';

// Your code here...
class PocketModel {
    constructor() {
        this.monitor = new PageChangeModule();
        var self = this;
        this.monitor.onChange = function(oldValue, newValue) {
            if (newValue.indexOf('read') != -1) {
                console.log('looking at an article now');
                self.updateLink();
            }
        }
        this.monitor.onChange('First Load', location.href);
    }
    updateLink() {
        var viewLink = document.querySelector('a.css-ntn4bo');
        if (viewLink) {
            viewLink.target='_blank';
        } else {
            console.log('link not found');
        }
    }
}

document.pocketModel = new PocketModel();
console.log('Object created');
