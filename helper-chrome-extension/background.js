// The ID of the extension we want to talk to.
const extensionId = "jjkdinonnkgnnapdocolkjfnabepfkmj";
var running = false;

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.windows.getCurrent({"populate":true}, function(win){
		var urls = [];
		for(var i=0;i<win.tabs.length;i++){
			urls.push(win.tabs[i].url);
		}
		// console.log(urls);
		sendMessage(urls);
		
		setTimeout(function(){
			if(running){
				chrome.windows.remove(win.id);
			}else{
				chrome.management.launchApp(extensionId);
				setTimeout(function(){
					sendMessage(urls);
					setTimeout(function(){chrome.windows.remove(win.id);}, 1000);
				}, 2000);
			}

		}, 1000);
		
	});
});

function sendMessage(urls){
	chrome.runtime.sendMessage(extensionId, {'message': 'browser_tabs', 'tabs': urls});
}

// external from the extension
chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
  	console.log("got response");
    running =  (request.message == 'ack');
  }
);