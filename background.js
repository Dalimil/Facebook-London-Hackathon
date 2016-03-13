// Chrome.* APIs only work here

// width and height of the user's screen, in pixels, minus interface features
const WIDTH_WINDOW = screen.availWidth;
const HEIGHT_WINDOW = screen.availHeight;
// console.log("Window dim: "+WIDTH_WINDOW +"x"+HEIGHT_WINDOW);

var mainWindow = null;

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
      mainWindow = createdWindow;
      createdWindow.onBoundsChanged.addListener(function() {
        createdWindow.contentWindow.initDimensions();
        createdWindow.contentWindow.updateCoordinates();
      });
  	});
});



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "save_storage" ) {
      chrome.storage.sync.set({'data': request.data});
    } else if( request.message === 'load_storage' && mainWindow != null) {
      chrome.storage.sync.get('data', function(data){
        mainWindow.contentWindow.loadFromStorageCallback(data["data"]);
      });
    }
  }
);

// external from the helper extension
chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request.message == 'browser_tabs'){
      for(var i=0;i<request.tabs.length;i++){
        var url = request.tabs[i];
        mainWindow.contentWindow.addNewViewFromLauncher(url);
      }
    }
  }
);
