// TODO
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.message === "clicked_browser_action" ) {
			console.log("message received in content.js - clicked_browser_action");

			// can pass back data from inside the page
			chrome.runtime.sendMessage({"message": "ack", "data": $("a[href^='http']").eq(0).attr("href") });
		}
	}
);

$(document).ready(function(){ // Executes when the DOM (document object model) has been loaded.
    console.log("document loaded"); 
});

$(window).load(function() { // Executes when the page is fully loaded, including all frames, images, ...
	console.log("page fully loaded"); 
});

