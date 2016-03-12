'use strict'

/** Controls the main window contents */
var WIDTH = null; 
var HEIGHT = null; 

var root = null;
var viewDims = []; // {id:, left:, top:, width:, height:} for checking mouseX/Y

var getNewId = (function () {
    var counter = 0;
    return function () {
    	counter += 1; 
    	return "webview-id-"+counter;
    }
})();

function initDimensions(){
	WIDTH = $(document).width();
	HEIGHT = $(document).height();
	console.log("Content dim: "+WIDTH +"x"+HEIGHT);
}

function node() {
    this.type = "leaf"; // Split type: "horizontal"/"vertical"/"leaf"
    this.first = {}; // { "percent": 0.6, "ref": node }
    this.second = {}; // { "ref": node } ... use 1.0 - 0.6 for percentage
    this.data = null; // for leaves: { url:, id: }
}

$(document).ready(function(){
	initDimensions();

	initRootView("https://facebook.com");
});

function getViewIdFromCoordinates(mouseX, mouseY){
	var offsetX = 0; //TODO
	var offsetY = 0; //TODO

	for(var i=0;i<viewDims.length;i++){
		var v = viewDims[i];
		if(mouseX >= v["left"] && mouseX < v["left"]+v["width"] && mouseY >= v["top"] && mouseY < v["top"]+v["height"]){
			return v["id"];
		}
	}
	console.log("error: couldn't find a view matching this mouse coordinates");
	return null;
}

function getNodeFromId(u, viewId) {
	if(u.type == "leaf"){
		if(u.data["id"] == viewId){
			return u;
		}
		return null;
	}
	var p1 = getNodeFromId(u.first["ref"], viewId);
	var p2 = getNodeFromId(u.second["ref"], viewId);
	if(p1 == null) return p2;
	return p1;
}

/* Like addNewView for the root  - only call this once during app init */
function initRootView(url){
	root = new node();
	var id = getNewId();
	root.data = {"url": url, "id": id};
	createHtmlView(id, url);
	updateCoordinates();
}

/** Create a new view (open/add), 
  * viewId is the id of an existing view that should be split in two 
  */
function addNewView(viewId, url, horizontal){
	var u = getNodeFromId(root, viewId);
	if(u == null){
		console.log("viewId not found");
		return;
	}
	console.log(u);
	u.type = (horizontal)?"horizontal":"vertical";
	u.first = {"percent": 0.5, "ref": null};
	u.first["ref"] = new node();
	u.first["ref"].data = u.data;
	u.data = null;
	u.second["ref"] = new node();
	var viewId = getNewId();
	u.second["ref"].data = {"url":url, "id": viewId};
	createHtmlView(viewId, url);
	updateCoordinates();
}

function createHtmlView(viewId, url){
	var webview = $("<webview>", {id: viewId, src: url});
	webview.css("position", "absolute");
	$("#views").append(webview);
}

function removeHtmlView(viewId){
	$("#"+viewId).remove();
}

function updateCoordinates(){
	viewDims = [];
	console.log("ok " + root);
	updateCoordinatesPrivate(root, 0, 0, WIDTH, HEIGHT);
}

function updateCoordinatesPrivate(u, left, top, width, height){
	if(u.type == "leaf"){
		updateView(u.data["id"], {"left":left, "top":top, "width":width, "height":height});
		viewDims.push({"id":u.data["id"], "left":left, "top":top, "width":width, "height":height});
		return;
	}

	var k = u.first["percent"];
	if(u.type == "horizontal"){ // | -- |
		updateCoordinatesPrivate(u.first["ref"], left, top, width, height*k);
		updateCoordinatesPrivate(u.second["ref"], left, top + height*k, width, height - height*k);
	}else if(u.type == "vertical"){ // -- | --
		updateCoordinatesPrivate(u.first["ref"], left, top, width*k, height);
		updateCoordinatesPrivate(u.second["ref"], left + width*k, top, width - width*k, height);
	}
}

/** Update params of a given view-viewId */
function updateView(viewId, params){
	var webview = $("#"+viewId);
	$.each(params, function( key, value ) {
		webview.css(key, value);
	});
}

/** Called when a view should be removed (closed). */
function removeView(viewId) { 
	// TODO
}

/** Used by background.js - resets all windows to default sizes */
function resetLayout(){
	initDimensions();
	// TODO
}

function clearAll(){
	// TODO
}

function debug(){
	console.log(root);
	console.log(viewDims);
}