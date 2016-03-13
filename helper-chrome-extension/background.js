// The ID of the extension we want to talk to.
var extensionId = "jjkdinonnkgnnapdocolkjfnabepfkmj";

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.windows.getCurrent({"populate":true}, function(win){
		var urls = [];
		for(var i=0;i<win.tabs.length;i++){
			urls.push(win.tabs[i].url);
		}
		// console.log(urls);
		chrome.runtime.sendMessage(extensionId, {'message': 'browser_tabs', 'tabs': urls});
		setTimeout(function(){chrome.windows.remove(win.id);}, 300);
	});
});