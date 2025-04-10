// ==UserScript==
// @name         Auto Skip YouTube Ads
// @version      1.0.2
// @description  Speed up and skip YouTube ads automatically
// @author       codiac-killer
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/subscribe_embed?*
// ==/UserScript==

let main = new MutationObserver(() => {
	// Get skip button and click it
    let buttons = [];
    buttons = buttons.concat(Array.from(document.getElementsByClassName("ytp-ad-skip-button ytp-button")));
    buttons = buttons.concat(Array.from(document.getElementsByClassName("ytp-skip-ad-button")));
	let btn = buttons[0];
	if (btn) {
		btn.click()
        console.log('Skipped ad');
	}

	// (unskipable ads) If skip button didn't exist / was not clicked speed up video
	const ad = [...document.querySelectorAll('.ad-showing')][0];
	if (ad) {
		// Speed up and mute
		document.querySelector('video').playbackRate = 16;
		document.querySelector('video').muted = true;
        console.log('Sped up and muted ad');
	}
})

main.observe(document.getElementsByClassName("video-ads ytp-ad-module").item(0), {attributes: true, characterData: true, childList: true})
console.log('Auto Youtube Ad Skip is active');
