// Chrome.* APIs only work here

// width and height of the user's screen, in pixels, minus interface features
const WIDTH = screen.availWidth;
const HEIGHT = screen.availHeight;
console.log("Available: "+WIDTH +"x"+HEIGHT);

var dockedWindows = [];

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.browserAction.setBadgeText({"text": "Hi"});
	chrome.browserAction.setBadgeBackgroundColor({"color": [0, 0, 255, 255]});

	sendTestMessage();
	// Dock current
	chrome.windows.getCurrent(function(window) {
		dock(window.id);
	});
});

/** Send a test message to the active tab */
function sendTestMessage(){ 
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
	});
}

/** Dock the current browser window */
function dock(windowId){
	/* windowId = integer ID of the removed window. */
	params = getNewWindowParams();
	params["state"] = "normal";
	chrome.windows.update(windowId, params);
	console.log("updated: " + windowId);
	// TODO: add windowId to internal representation
}

function getNewWindowParams(){
	// TODO
	return {"left": 0, "top": 0, "width": 600, "height": 300};
}

/** Fired when a window is removed (closed). */
chrome.windows.onRemoved.addListener(function(windowId) { 
	/* windowId = integer ID of the removed window. */
	// TODO: remove from internal representation
});

// TODO
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.message === "ack" ) {
			// use request object data here
			console.log("got response");
		}
	}
);
