'use strict';

/** Controls the main window contents */
var WIDTH = null; 
var HEIGHT = null; 

var root = null;
var viewDims = []; // {id:, left:, top:, width:, height:} for checking mouseX/Y

var webViewsStore = [];

var getNewId = (function () {
    var counter = 0;
    return function () {
    	counter += 1; 
    	return "webview-id-"+counter;
    }
})();

function initDimensions(){
	var viewsRoot = $("#views");
	WIDTH = viewsRoot.width();
	HEIGHT = viewsRoot.height();
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

	loadFromStorage();
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
	if(p1 != null) return p1;
	var p2 = getNodeFromId(u.second["ref"], viewId);
	return p2;
}

function getParentNodeFromId(u, viewId) {
	if(u.type == "leaf"){
		return null;
	}
	if((u.first["ref"].type == "leaf" && u.first["ref"].data["id"] == viewId) ||
		(u.second["ref"].type == "leaf" && u.second["ref"].data["id"] == viewId) ){
		return u;
	}
	var p1 = getParentNodeFromId(u.first["ref"], viewId);
	if(p1 != null) return p1;
	var p2 = getParentNodeFromId(u.second["ref"], viewId);
	return p2;
}

/* Like addNewView but for the root  */
function initRootView(url){
	root = new node();
	var id = getNewId();
	root.data = {"url": url, "id": id};
	createHtmlView(id, url);
	updateCoordinates();
	saveLayoutToStorage();
}

/** Create a new view (open/add), 
  * viewId is the id of an existing view that should be split in two 
  */
function addNewView(viewId, url, horizontal, firstHalf){
	if(root == null){
		initRootView(url);
		return;
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

	if(firstHalf){
		var tmp = u.first["ref"];
		u.first["ref"] = u.second["ref"];
		u.second["ref"] = tmp;
	}
	createHtmlView(viewId, url);
	updateCoordinates();
	saveLayoutToStorage();
}

function addNewViewFromLauncher(url){
	var mxArea = -1;
	var value = null;
	$.each(viewDims, function( index, val ) {
		var area = val["width"]*val["height"];
		if(area >= mxArea){
			mxArea = area;
			value = val;
		}
	});
	if(value == null) return;
	var horizontal = true;
	var firstHalf = false;
	if(value["width"]/value["height"] >= WIDTH/HEIGHT){
		horizontal = false;
	}
	addNewView(value["id"], url, horizontal, firstHalf);
}

function moveView(newViewId, oldObject, horizontal, firstHalf) {
    if(root == null){
        initRootView(url);
    }

    var u = getNodeFromId(root, newViewId);
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
    u.second["ref"].data = {"id": viewId}; //TODO: set url

    if(firstHalf){
        var tmp = u.first["ref"];
        u.first["ref"] = u.second["ref"];
        u.second["ref"] = tmp;
    }

    oldObject.changeId(viewId);
    webViewsStore[viewId] = oldObject;
    $("#views").append(oldObject.getHtml());
    updateCoordinates();
}

function createHtmlView(viewId, url){
	var webViewObject = new WebViewElement(url, viewId);
	webViewObject.webViewElement.addEventListener('contentload', function() {
	  	// update our saved url
	  	var id = $(webViewObject.domElement).attr("id");
	  	var u = getNodeFromId(root, id);
		if(u != null){
			u.data["url"] = $(webViewObject.webViewElement).attr('src');
			console.log(u.data["url"]);
			saveLayoutToStorage();
		}
	});

    webViewsStore[viewId] = webViewObject;

	var webViewHtml = webViewObject.getHtml();
	
	$("#views").append(webViewHtml);
	setupForDrop(webViewHtml, webViewObject);
}

function createAllHtmlViews(u){
	if(u.type == "leaf") {
		createHtmlView(u.data["id"], u.data["url"]);
		return;
	} else {
		createAllHtmlViews(u.first["ref"]);
		createAllHtmlViews(u.second["ref"]);
	}
}

function removeHtmlView(viewId){
	$("#"+viewId).remove();
}

function updateCoordinates(){
	viewDims = [];
	if(root == null){
		return;
	}
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
	if(root.type == "leaf" && root.data["id"] == viewId){ // single view
		root = null;
	} else {
		var u = getParentNodeFromId(root, viewId);
		if(u == null){
			console.log("parent of viewId not found");
			return;
		}
		console.log(u);
		if(u.first["ref"].type == "leaf" && u.first["ref"].data["id"] == viewId){
			u.type = u.second["ref"].type;
			u.data = u.second["ref"].data;
			u.first = u.second["ref"].first;
			u.second = u.second["ref"].second;
		} else{ // u = u.first["ref"]
			u.type = u.first["ref"].type;
			u.data = u.first["ref"].data;
			u.second = u.first["ref"].second;
			u.first = u.first["ref"].first;
		}
	}
    delete webViewsStore[viewId];
    webViewsStore[viewId] = null;
	removeHtmlView(viewId);
	updateCoordinates();
	saveLayoutToStorage();
}

/** Used by background.js - resets all windows to default sizes */
function resetLayout(){
	initDimensions();
	// TODO
	saveLayoutToStorage();
}

function clearAll(){
	var viewDimsBckup = viewDims.slice();
	$.each(viewDimsBckup, function( index, value ) {
		removeView(value["id"]);
	});
}

function saveLayoutToStorage(){
	chrome.runtime.sendMessage({"message": "save_storage", "data": JSON.stringify(root)});	
}

function loadFromStorage(){
	chrome.runtime.sendMessage({"message": "load_storage"});	
}

function loadFromStorageCallback(data){
	console.log("Loaded: "+data);
	if(data == null){
		initRootView("https://google.com");
	} else{
		root = JSON.parse(data);
		createAllHtmlViews(root);
		updateCoordinates();
	}
}

function debug(){
	console.log(root);
	console.log(viewDims);
}
