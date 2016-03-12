// Chrome.* APIs only work here

// width and height of the user's screen, in pixels, minus interface features
const WIDTH_WINDOW = screen.availWidth;
const HEIGHT_WINDOW = screen.availHeight;
console.log("Window dim: "+WIDTH_WINDOW +"x"+HEIGHT_WINDOW);

var contentWindow = null;

/** When launched */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('main.html', {
    outerBounds: {
      width: WIDTH_WINDOW,
      height: HEIGHT_WINDOW,
      left: 0,
      top: 0
    },
    frame: "chrome"
  }, function(createdWindow) {
  		WIDTH = createdWindow.innerBounds.width;
  		HEIGHT = createdWindow.innerBounds.height;
  		contentWindow = createdWindow.contentWindow;
  		console.log("Content dim: "+WIDTH+"x"+HEIGHT);
  	});
});

chrome.app.window.onBoundsChanged.addListener(function() {
	contentWindow.resetLayout();
});
