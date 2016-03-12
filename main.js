'use strict'

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
	console.log(event.dataTransfer.types[0])
	if(event.dataTransfer.types[0] === 'text/plain') {
		var url = event.dataTransfer.getData('text');
		var domel = webview.domElement;
		var width = domel.width();
		var height = domel.height();
		var x = event.offsetX;
		var y = event.offsetY;
		var px = ((x / width) - 0.5) * 2;
		var py = ((y / height) - 0.5) * 2;
		var id = domel.attr('id');
		console.log(`px${px}, py${py}`);
		console.log(id);
		if(py > px) {
			addNewView(id, url, false);
		} else {
			addNewView(id, url, true);
		}
		console.log(ev);
		console.log(webview);
	}
}