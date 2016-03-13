'use strict';

function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}

function setupForDrop(webViewHtml, webViewObject) {
	var enterCount = 0;
	webViewHtml.on('dragenter', function(ev){
		if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain' || event.dataTransfer.types[0] === 'htmlid') {
			var text = event.dataTransfer.getData('text');
			if(enterCount == 0){addToWindow(webViewObject);}
		}
		enterCount++;
	});
	webViewHtml.on('dragleave', function(ev){
		enterCount--;
		if(enterCount == 0) {
			resetWindow(webViewObject);
		}
		if(enterCount < 0) enterCount = 0;
	});
	$(webViewObject.webViewElement).on('dragover', function(ev){ev.stopPropagation();});
	webViewHtml.on('dragover', function(ev){ev.originalEvent.dataTransfer.dropEffect = "move"; ev.preventDefault();});
	webViewHtml.on('drop', function(ev){drop(webViewObject, ev); enterCount = 0;});
}

function addToWindow(webview) {
	$(webview.webViewElement).animate({transform: 'scale(.9,.9)'});
	$(webview.controlsElement).css('visibility', 'hidden');
	webview.hideMenu();
}

function resetWindow(webview) {
	$(webview.webViewElement).animate({transform: 'scale(1,1)'});
	$(webview.controlsElement).delay(500).css('visibility', 'visible');
}

function drop(webview, ev) {
	resetWindow(webview);
	// If it's plain text we can attempt to open this
	//console.log(event.dataTransfer.types[0])
	var domel = webview.domElement;
	var width = domel.width();
	var height = domel.height();
	var x = event.offsetX;
	var y = event.offsetY;
	var px = ((x / width) - 0.5) * 2;
	var py = ((y / height) - 0.5) * 2;
	var id = domel.attr('id');

	if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
		var url = event.dataTransfer.getData('text');
		//if (isUrl(url)) {
		if(Math.abs(py) < Math.abs(px)) {
			addNewView(id, url, false, px < 0.5);
		} else {
			addNewView(id, url, true, py < 0.5);
		}
		//}
	} else if(event.dataTransfer && event.dataTransfer.types[0] === 'htmlid') {
		var idToMove = event.dataTransfer.getData('htmlid');
		var oldObj = webViewsStore[idToMove];
		if(Math.abs(py) < Math.abs(px)) {
			moveView(id, oldObj, false, px < 0.5);
		} else {
			moveView(id, oldObj, true, py < 0.5);
		}
		removeView(idToMove);
	}
}