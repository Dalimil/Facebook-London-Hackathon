// The ID of the extension we want to talk to.
var extensionId = "jjkdinonnkgnnapdocolkjfnabepfkmj";

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.windows.getCurrent({"populate":true}, function(window){
		chrome.runtime.sendMessage(extensionId, {'message': 'browser_tabs', 'data': window.tabs}, function(response) {
		  console.log("done");
		});
	});
});