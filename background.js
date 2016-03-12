// Chrome.* APIs only work here

// width and height of the user's screen, in pixels, minus interface features
const WIDTH = screen.availWidth;
const HEIGHT = screen.availHeight;
console.log("Available: "+WIDTH +"x"+HEIGHT);

var dockedWindows = [];

/** When launched */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('main.html', {
    'outerBounds': {
      'width': WIDTH,
      'height': HEIGHT
    }
  });
});


/** Dock the current browser window */
function dock(windowId){
	/* windowId = integer ID of the removed window. */
	params = getNewWindowParams();
	params["state"] = "normal";
	// chrome.windows.update(windowId, params);
	console.log("updated: " + windowId);
	// TODO: add windowId to internal representation
}

function getNewWindowParams(){
	// TODO
	return {"left": 0, "top": 0, "width": 600, "height": 300};
}

/** Fired when a window is removed (closed). */
function windowRemoved(windowId) { 
	/* windowId = integer ID of the removed window. */
	// TODO: remove from internal representation
}

