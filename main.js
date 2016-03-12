'use strict'

function addToWindow(webview) {
	$(webview).animate({transform: 'scale(.9,.9)'});
}

function resetWindow(webview) {
	$(webview).animate({transform: 'scale(1,1)'});
}

function drop(webview, ev) {
	resetWindow(webview);
	console.log(ev);
	// Add new window if this is a url!
}