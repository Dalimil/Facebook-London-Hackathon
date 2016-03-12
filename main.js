'use strict'

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

var curId = 1;

function getViewByID(viewid) {
	return $('.view-container').filter(function(){
		return $(this).data('viewid') == viewid;
	});
}

function newContainer(url) {
	var wv = document.createElement('webview');
	wv.src = url;
	var container = $('<div class="view-container"></div>');
	container.append(wv);
	container.data('viewid', curId);
	curId++;
	return container;
}

/** Create a new view (open/add) */
function addView(viewId, url){
	var params = getNewWindowParams();
	var view = getViewByID(viewId);
	view.append(newContainer(url));
	// TODO: add windowId to internal representation
}

function updateView(viewId){
	//
}

/** Called when a view is removed (closed). */
function removeView(viewId) {
	// Cannot remove root! - instead redirect to new button thing?
	if(viewId != '0') {
		getViewByID(viewId).remove();
	}
}

function getNewWindowParams(){
	// TODO
	return {"left": 0, "top": 0, "width": 600, "height": 300};
}

/** Used by background.js */
function resetLayout(){
	//
}
