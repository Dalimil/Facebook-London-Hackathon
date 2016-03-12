'use strict'

/** Controls the main window contents */
var WIDTH = null; 
var HEIGHT = null; 

var views = {};

$(document).ready(function(){
	initDimensions();

	addNewView(1, "https://facebook.com");
});

function initDimensions(){
	WIDTH = $(document).width();
	HEIGHT = $(document).height();
	console.log("Content dim: "+WIDTH +"x"+HEIGHT);
}

/** Create a new view (open/add) */
function addNewView(viewId, url){
	var params = createNewWindowParams();
	var webview = $("<webview>", {id: viewId, src: url});
	$.each(params, function( key, value ) {
		webview.css(key, value);
	});
	webview.css("position", "absolute");
	$("#views").append(webview);
	views[viewId] = params;
	return params; // debug
}

function createNewWindowParams(){
	var mxArea = -1;
	var id = null;
	$.each(views, function( key, value ) {
		var area = value["height"]*value["width"];
		if(area > mxArea){
			mxArea = area;
			id = key;
		}
	});

	if(id == null) {
		return {"left": 0, "top": 0, "width": WIDTH, "height": HEIGHT};
	} else {
		var w = views[id].width;
		var h = views[id].height;
		if(w/h >= WIDTH/HEIGHT){
			// vertical split
			updateView(id, {"width": w/2});
			return {"left": views[id].left + w/2, "top": views[id].top, "width": w/2, "height": h};
		}else{
			//horizontal split
			updateView(id, {"height": h/2});
			return {"left": views[id].left, "top": views[id].top + h/2, "width": w, "height": h/2};
		}
	}
}

function updateView(viewId, params){
	var webview = $("#"+viewId);
	$.each(params, function( key, value ) {
		views[viewId][key] = value;
		webview.css(key, value);
	});
}

/** Called when a view should be removed (closed). */
function removeView(viewId) { 
	$("#"+viewId).remove();
	delete views[viewId];
}

/** Used by background.js - resets all windows to default sizes */
function resetLayout(){
	initDimensions();
	var len = Object.keys(viwes).length;
	// TODO
}

function clearAll(){
	$.each(views, function( key, value ) {
		removeView(key);
	});
}

function debug(){
	console.log(views);
}
