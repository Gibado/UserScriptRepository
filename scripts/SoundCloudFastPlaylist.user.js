// ==UserScript==
// @name         Sound Cloud Enhancements
// @namespace    https://github.com/tstudanski/
// @version      2024.3.5.0
// @description  Adds things to make it easier to use
// @author       Tyler Studanski <tyler.studanski@mspmac.org>
// @match        https://soundcloud.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soundcloud.com
// @downloadURL  https://github.com/Gibado/UserScriptRepository/raw/master/scripts/SoundCloudFastPlaylist.user.js
// @updateURL    https://github.com/Gibado/UserScriptRepository/raw/master/scripts/SoundCloudFastPlaylist.user.js
// @require      https://github.com/tstudanski/UserScripts/raw/main/common/Elmtify.js
// @require      https://github.com/tstudanski/UserScripts/raw/main/common/WaitFor.js
// @require      https://github.com/tstudanski/UserScripts/raw/main/common/ChangeModule.js
// @grant        none
// ==/UserScript==

'use strict';
// Your code here...

// NOTE: This site modifies JQuery so don't use it

class SoundCloudModel {
    env = 'prod'
    constructor(playlistName) {
        this.playlistName = playlistName;
        this.playlistCodeName = playlistName.trim().toLowerCase().split(' ').join('-');
        this.addQuickSaveButton();
        console.log('Setup for playlist: ' + playlistName);
        var self = this;
        this.monitor = new OnChangeModule(500, function(){
            return document.querySelectorAll('#saveToList').length;
        }, function() {
            self.addQuickSaveButton();
        });
    }
    debug(...data) {
        if (this.env != 'prod') {
            console.log(data);
        }
    }
    addQuickSaveButton() {
        this.debug('Adding Quick Save button');
        var old = document.querySelector('#saveToList');
        if (old) {
            old.remove();
        }
        var actionsMenu = document.querySelector('.playbackSoundBadge__actions');
        var saveButton = elmtify('<button id="saveToList" type="button" class="sc-button-addtoset sc-button-secondary sc-mr-1x sc-button sc-button-small sc-button-icon sc-button-responsive" tabindex="0" title="Save" aria-label="Save">Save</button>');
        var self = this;
        saveButton.onclick = function() {
            self.saveSong();
        }
        actionsMenu.appendChild(saveButton);
    }
    saveSong() {
        this.activeSong = document.querySelector('.playbackSoundBadge__titleLink').textContent.trim();
        this.debug('Adding song: ' + this.activeSong);
        // Open current queue
        document.querySelector('.playbackSoundBadge__showQueue').click();
        var self = this;
        // Open options on active song
        waitFor(function() {
            var target = document.querySelector('.m-active');
            if (target && target.querySelector('.queueItemView__more')) {
                return true;
            }
            return false;
        }, function() {
            self.debug('Opening options');
            document.querySelector('.m-active').querySelector('.queueItemView__more').click();
        })

        // Click Add to Playlist
        waitFor(function() {
            if (document.querySelector('.sc-button-addtoset.moreActions__button')) {
                return true;
            }
            return false;
        }, function() {
            self.debug('Opening playlists');
            document.querySelector('.sc-button-addtoset.moreActions__button').click();
        })
        
        // Find specific playlist
        waitFor(function() {
            if (document.querySelector('a[href$="' + self.playlistCodeName + '"]')) {
                return true;
            }
            return false;
        }, function() {
            self.debug('Adding ' + self.activeSong + ' to ' + self.playlistName);
            var imageLink = document.querySelector('a[href$="' + self.playlistCodeName + '"]');
            imageLink.parentElement.querySelector('.addToPlaylistButton').click();
            console.log('Added ' + self.activeSong + ' successfully');
        })

        // Close modal
        waitFor(function() {
            if (document.querySelector('.modal__closeButton')) {
                return true;
            }
            return false;
        }, function() {
            self.debug('Closing modal');
            document.querySelector('.modal__closeButton').click();
        })

        // Hide queue
        waitFor(function() {
            if (document.querySelector('.queue__hide')) {
                return true;
            }
            return false;
        }, function() {
            self.debug('Hiding queue');
            document.querySelector('.queue__hide').click();
        })
    }
}

window.onload = function() {
    document.soundModel = new SoundCloudModel('Need in my Life');
    document.soundModel.debug('Object created');
}
