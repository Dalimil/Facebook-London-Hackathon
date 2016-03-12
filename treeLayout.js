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

function getParentNodeFromId(u, viewId) {
	if(u.type == "leaf"){
		return null;
	}
	if((u.first["ref"].type == "leaf" && u.first["ref"].data["id"] == viewId) ||
		(u.second["ref"].type == "leaf" && u.second["ref"].data["id"] == viewId) ){
		return u;
	}
	var p1 = getNodeFromId(u.first["ref"], viewId);
	var p2 = getNodeFromId(u.second["ref"], viewId);
	if(p1 == null) return p2;
	return p1;
}

/* Like addNewView but for the root  */
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
	if(root == null){
		initRootView(url);
	}

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
	var webViewElementHtml = new WebViewElement(url, viewId);
	$("#views").append(webViewElementHtml);
	var webview = webViewElementHtml.webViewElement;
	var enterCount = 0;
	webViewElementHtml.on('dragenter', function(ev){
		console.log(ev);
		if(enterCount == 0){addToWindow(webview);}
		enterCount++;
	});
	webViewElementHtml.on('dragleave', function(ev){
		console.log(ev);
		enterCount--;
		if(enterCount == 0)
			resetWindow(webview);
		if(enterCount < 0) enterCount = 0;
	});
	webViewElementHtml.on('dragover', function(ev){ev.originalEvent.dataTransfer.dropEffect = "copy"; ev.preventDefault();});
	webViewElementHtml.on('drop', function(ev){console.log(ev); drop(webview, ev); enterCount = 0;});
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
	if(root.type == "leaf" && root.data["id"] == viewId){
		root = null;
	} else {
		var u = getParentNodeFromId(root, viewId);
		if(u == null){
			console.log("parent of viewId not found");
			return;
		}
		console.log(u);
		if(u.first["ref"].type == "leaf" && u.first["ref"].data["id"] == viewId){
			u = u.second["ref"];
		} else{
			u = u.first["ref"];
		}
	}
	removeHtmlView(viewId);
	updateCoordinates();
}

/** Used by background.js - resets all windows to default sizes */
function resetLayout(){
	initDimensions();
	// TODO
}

function clearAll(){
	var viewDimsBckup = viewDims.slice();
	$.each(viewDimsBckup, function( index, value ) {
		removeView(value);
	});
}

function debug(){
	console.log(root);
	console.log(viewDims);
}
