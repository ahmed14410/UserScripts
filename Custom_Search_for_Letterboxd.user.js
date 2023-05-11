// ==UserScript==
// @name         Custom Search Links For Letterboxd
// @author       ahmed14410
// @namespace    https://github.com/ahmed14410/UserScripts/blob/master/Custom_Search_for_Letterboxd.user.js
// @version      1.1
// @description  Add your custom search sources for Letterboxd
// @license      MIT
// @match        https://letterboxd.com/film/*
// @match        https://subscene.com/subtitles/title?q=*
// @icon         https://raw.githubusercontent.com/ahmed14410/UserScripts/master/img/letterboxd_icon.png
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

if (location.hostname === 'letterboxd.com') {

(function() {
'use strict';
// Define your custom search sources here
let customSearchSources = [
    {
        name: 'Google',
        url: 'https://www.google.com/search?q=%query%',
    },
    {
        name: 'Subscene',
        url: 'https://subscene.com/subtitles/title?q=%query%',
    },
    {
        name: 'RARBG',
        url: 'https://rarbg.to/torrents.php?search=%query%',
    },
    {
        name: '1337x',
        url: 'https://1337x.to/search/%query%/1/',
    },
];

// Get all the film links on the page
let filmLinks = document.querySelectorAll('.film-detail-header a, .poster-list a');

// Loop through each film link and add custom search links
for (let i = 0; i < filmLinks.length; i++) {
	let link = filmLinks[i];
	let url = link.href;

	// Use the URL to get the title of the film
	let title = '';
	let match = url.match(/letterboxd\.com\/film\/([\w-]+)/);
	if (match) {
		title = match[1].replace(/-/g, ' ');
	}

	// Loop through each custom search source and add a link
	for (let j = 0; j < customSearchSources.length; j++) {
		let source = customSearchSources[j];
		let query = encodeURIComponent(title);
		let urlWithQuery = source.url.replace('%query%', query);
		let searchLink = document.createElement('a');
		searchLink.href = urlWithQuery;
		searchLink.innerText = '[' + source.name + ']';
		searchLink.target = '_blank';
		searchLink.style.marginLeft = '5px';
		link.parentNode.insertBefore(searchLink, link.nextSibling);
	}
}
})();

} else if (location.hostname === 'subscene.com') {

(function() {
'use strict';
let url = window.location.href;
let searched = $('input#query').val();

if (url.search(/subtitles\/title\?q\=/) >= 0) {
	window.stop();
	const myTimeout = setTimeout(function(){
		var urlParams = new URLSearchParams(window.location.search);
		var postKeyword = urlParams.get('q');
		var postUrl = '/subtitles/searchbytitle';

		if (urlParams.get('q') && postKeyword !== '') {
			var postForm = document.createElement("form");
			postForm.setAttribute("method", "post");
			postForm.setAttribute("action", postUrl);
			var hiddenField = document.createElement("input");
			hiddenField.setAttribute("name", "query");
			hiddenField.setAttribute("value", postKeyword);
			hiddenField.setAttribute("type", "hidden");
			postForm.appendChild(hiddenField);
			document.getElementsByTagName('html')[0].appendChild(postForm);
			postForm.submit();
		}
		else{
			document.location = 'https://subscene.com/subtitles';
		}
	}, 0);
}
else if (url.search("subtitles/searchbytitle") >= 0 && searched != null) {
	history.pushState({}, "", 'https://subscene.com/subtitles/title?q=' + searched);
}
})();

} else {
console.log('Unsupported domain');
}
