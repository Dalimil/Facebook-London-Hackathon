/** Controls the main window contents */
var WIDTH = null; 
var HEIGHT = null; 

var views = [];

$(document).ready(function(){
	WIDTH = $(document).width();
	HEIGHT = $(document).height();
	console.log("Content dim: "+WIDTH +"x"+HEIGHT);

	addView(1, "https://facebook.com");
});

/** Create a new view (open/add) */
function addView(viewId, url){
	params = getNewWindowParams();
	var webview = $("<webview>", {id: viewId, src: url, style: params});
	$("#views").append(webview);
	// TODO: add windowId to internal representation
}

function updateView(viewId){
	//
}

/** Called when a view is removed (closed). */
function removeView(viewId) { 
	// TODO: remove from internal representation
}

function getNewWindowParams(){
	// TODO
	return {"left": 0, "top": 0, "width": 600, "height": 300};
}

/** Used by background.js */
function resetLayout(){
	//
}