// ==UserScript==
// @name        1Channel Streamline
// @author      Tyler Studanski
// @copyright   2019
// @namespace   https://github.com/Gibado
// @description Brings you to the video by clicking the right buttons.  Currently supports 15 sites
// @version     2019.7.10.1
// @downloadURL https://github.com/Gibado/UserScriptRepository/raw/master/scripts/1ChannelStreamline.user.js
// @udpateURL   https://github.com/Gibado/UserScriptRepository/raw/master/scripts/1ChannelStreamline.user.js
// @grant       none

// @match		http://bestreams.net/*
// @match		http://daclips.in/*
// @match		http://filenuke.com/*
// @match		http://gorillavid.in/*
// @match		http://mega-vids.com/*
// @match		http://mightyupload.com/*
// @match		http://movpod.in/*
// @match		http://www.promptfile.com/l/*
// @match		http://sharerepo.com/*
// @match		http://sharesix.com/*
// @match		http://www.sockshare.ws/file/*
// @match		http://www.thevideo.me/*
// @match		http://www.videoweed.es/file/*
// @match		http://www.vodu.ch/file/*
// ==/UserScript==

// ==Version History==
// 2019.7.10.1 - Updated download and update URLs and copyright date
// 2019.7.10.0 - Moved to GitHub.com
// v2.9 - Refactored object framework to not overwrite existing
//			object definition.
// v2.8 - Fixed compile errors
// v2.7 - Updated generateSiteList function to also value document.gibado.OneChannel.siteList
// v2.6 - Refactored to a more object oriented format.  This
//			simplified the code drastically by removing duplicate code.
// v2.5 - Updated the downloadURL
// v2.4 - Added the following sources: www.thevideo.me, daclips.in
// v2.3 - Changed include list to match list for security
//		- Fixed bug #5
//		- Organized the code to make searching for site specific code easier
//		- Added the following source: Sharerepo.com, PutLocker
// v2.2 - Added support for marking supported sites
// v2.1 - Minimized code and added the following source: movpod.in
// v2.0 - Added the following source: gorillavid.in
// v1.9 - Added the following source: mega-vids.com
// v1.8 - Added the following source: bestreams.net
// v1.7 - Cleaned up some of the code and added the following sources: www.vudo.ch
// v1.6 - Fixed Sock Share bug with continue
// v1.5 - Added the following sources: www.sockshare.ws
// v1.4 - Fixed updating tags so that they work
// v1.3 - Added author and copyright tags
//		- Added the following sources: mightyupload.com
// v1.2 - Added updating tags
// v1.1 - Added the following sources: www.filenuke.com, www.videoweed.es, sharesix.com
// v1.0 - First working version.  Works for www.promtfile.com
// ==/Version History==

// ==Bugs==
// #5 - [Fixed in 2.3] Multiple sources stopped working including: BeStreams, ShareSix, FileNuke
// #4 - Mega-Vids has an annoying pop-up when clicking anywhere on the screen
// #3 - Be Streams has an annoying pop-up when clicking anywhere on the screen
// #2 - [Fixed in 1.6] SockShare removes ads but doesn't click continue
// #1 - Mighty Upload needs captcha support
// ==/Bugs==

if (typeof(document.gibado)==='undefined') {
	document.gibado = {};
}
if (typeof(document.gibado.OneChannel)==='undefined') {
	document.gibado.OneChannel = {};
}

document.gibado.OneChannel.siteList = [];
document.gibado.OneChannel.siteObjects = function() {
	var siteList = [];
	siteList.push(this.createSite('bestreams', this.runBeStreams));
	siteList.push(this.createSite('daclips', this.runDaClips));
	siteList.push(this.createSite('filenuke', this.runFileNuke));
	siteList.push(this.createSite('gorillavid', this.runGorillaVid));
	siteList.push(this.createSite('mega-vids', this.runMegaVids));
	siteList.push(this.createSite('mightyupload', this.runMightyUpload));
	siteList.push(this.createSite('movpod', this.runMovPod));
	siteList.push(this.createSite('promptfile', this.runPromptFile));
	siteList.push(this.createSite('sharesix', this.runShareSix));
	siteList.push(this.createSite('sockshare', this.runSockShare));
	siteList.push(this.createSite('thevideo', this.runTheVideo));
	siteList.push(this.createSite('videoweed', this.runVideoWeed));
	siteList.push(this.createSite('vodu', this.runVudo));

	return siteList;
};

document.gibado.OneChannel.createSite = function (name, method) {
	return {name: name, method: method};
};

document.gibado.OneChannel.generateSiteList = function() {
	this.siteList = [];
	var siteObjects = this.siteObjects();
	for (var i = 0; i < siteObjects.length; i++) {
		this.siteList.push(siteObjects[i].name);
	}

	document.siteList = this.siteList;
};

document.gibado.OneChannel.runBeStreams = function() {
	//$("script:not([type]):not([src])").remove(); //Run before
	var copyScript, submitButton;

	$('#overlayPPU').remove();
	$('#OnPlayerBanner').remove();
	window.setInterval(function() {
		this.removeIframes();
		$('#rhw_footer').remove();
		$('#rh_toolbar_BESTREAMSNEW_TOPBANNER').remove();
	}, 2000);

	this.intervalButtonClick($('#btn_download'), 2);
};

document.gibado.OneChannel.runDaClips = function() {
	this.removeIframes();
	this.delayedButtonClick($('#btn_download'), 5);
	$('#ad_container').remove();
};

document.gibado.OneChannel.runFileNuke = function (){
	$('.btn-big2-2').click();
	this.removeIframes();
};

document.gibado.OneChannel.runGorillaVid = function () {
	this.removeIframes();
	this.delayedButtonClick($('#btn_download'), 6);
	$('#adk2_slider_top_left').remove();
	$('#ad_container').remove();
};

document.gibado.OneChannel.runMegaVids = function () {
	$('a[target=_blank]').remove();
	$('div.a-el').remove();
	this.removeIframes();
	$('#btn_download').click();
	this.player_start();
	// Attempting to remove adds
	var param, argStrs, i, arg;
	param = $('param[name=flashvars]');
	argStrs = param.val().split('&');
	for (i = 0; i < argStrs; i++) {
		arg = argStrs[i].split('=');
		//if (arg[0] == 'ova.ads') {
			arg[1] = '';
		//}
		argStrs[i] = arg.join('=');
	}
	param.val(argStrs.join('&'));
};

document.gibado.OneChannel.runMightyUpload = function (){
	var noClasses, noIds, i;
	this.removeIframes();
	noClasses = $('div:not([class])');
	noIds = [];
	i = 0;
	for (i = 0; i < noClasses.length; i++) {
		if (noClasses[i].id === "") {
			noIds.push(noClasses[i]);
		} else if (noClasses[i].id == "cdiv") {
			noClasses[i].remove();
		}
	}
	for (i = 0; i < noIds.length; i++) {
		noIds[i].remove();
	}
};

document.gibado.OneChannel.runMovPod = function () {
	this.removeIframes();
	this.delayedButtonClick($('#btn_download'), 5);
	$('#ad_container').remove();
};

document.gibado.OneChannel.runPromptFile = function (){
	$('button').click();
};

document.gibado.OneChannel.runShareSix = function (){
	$('.btn-big2-2').click();
	$('center').remove();
};

document.gibado.OneChannel.runSockShare = function () {
	this.removeIframes();
	if (Yesup.clicksor.Code[0].ITS) {
		Yesup.clicksor.Code[0].ITS.hide_intermission();
	}
	this.delayedButtonClick($('#agreeButton'), 5);
	$('.player_hover_ad').remove();
	play_video('play');
};

document.gibado.OneChannel.runTheVideo = function () {
	this.removeIframes();
	$('#btn_download').click();
	$('#overlayA').remove();
};

document.gibado.OneChannel.runVideoWeed = function (){
	$('.ad').remove();
	this.removeIframes();
};

document.gibado.OneChannel.runVudo = function () {
	this.removeIframes();
	this.delayedButtonClick($('#submitButton'), 5);
	play_video('play');
};

document.gibado.OneChannel.findSite = function () {
	var url, index, base, servlet;
	url = document.URL;
	index = url.indexOf('?');
	if (index != -1) {
		base = url.substring(0,url.indexOf('?'));
	} else {
		base = url;
	}
	servlet = base.substring(base.lastIndexOf('/'));
	return base;
};

document.gibado.OneChannel.removeIframes = function () {
	$('iframe').remove();
};

document.gibado.OneChannel.delayedButtonClick = function (button, seconds) {
	window.setTimeout(function() {
		button.click();
	}, (seconds * 1000));
};

document.gibado.OneChannel.intervalButtonClick = function (button, seconds) {
	window.setInterval(function() {
			button.click();
		}, (seconds * 1000));
};

$(document).ready(function(){
	var OneChannel = document.gibado.OneChannel;
    OneChannel.generateSiteList();
    var site = OneChannel.findSite();
	var siteObjects = OneChannel.siteObjects();

	for (var i = 0; i < siteObjects.length; i++) {
		if (site.indexOf(siteObjects[i].name) !== -1) {
			siteObjects[i].method();
			break;
		}
	}
});
