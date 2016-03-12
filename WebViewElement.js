"use strict";

function WebViewElement(src, id) {
    var _this = this;

    _this.domElement = createHtml(src, id);
    _this.dragWrapperElement = $(_this.domElement).find(".viewParent");
    _this.scrollDelta = 0;
    _this.webViewElement = $(_this.domElement).find(".webview").get(0);
    _this.controlsElement = $(_this.domElement).find(".viewControls");
    _this.controls = {
        backButton: $(_this.controlsElement).find(".back"),
        forwardButton: $(_this.controlsElement).find(".forward"),
        reloadButton: $(_this.controlsElement).find(".reload"),
        closeButton: $(_this.controlsElement).find(".close"),
        addressInputBar : $(_this.controlsElement).find(".addressInput"),
        dragHandleElement : $(_this.controlsElement).find(".move")
    };
    _this.viewContainerElement = $(_this.domElement).find(".viewContainer");

    _this.isLoading = false;

    $(_this.domElement).bind('mousewheel', onMouseWheel);
    $(_this.domElement).mouseleave(function() {_this.hideMenu();});

    $(_this.controls.backButton).click(function() {_this.goBack();});
    $(_this.controls.forwardButton).click(function() {_this.goForward();});
    $(_this.controls.reloadButton).click(function() {_this.reloadPage();});
    $(_this.controls.closeButton).click(function() {_this.closePage();});

    $(_this.controls.addressInputBar).keypress(function(event) {
        if (event.keyCode == 13) {
            _this.openUrl(_this.controls.addressInputBar.val());
        }
    });

    function onMouseWheel(event) {
        _this.scrollDelta += event.originalEvent.wheelDelta;
        if (_this.scrollDelta < -100) {
            _this.scrollDelta = -100;
        } else if (_this.scrollDelta > 100) {
            _this.scrollDelta = 100;
        }

        if (_this.scrollDelta > 5) {
            _this.showMenu();
        } else {
            _this.hideMenu();
        }
    }

    $(_this.domElement).draggable({
        handle: _this.controls.dragHandleElement,
        revert: true,
        start: function(){
            $(this).css({"z-index": "1000", "opacity": 0.5});
        },
        stop: function(){
            $(this).css({"z-index": "0", "opacity": 1});
        }
    }).css("position", "absolute");

    $(_this.domElement).droppable({
        drop: function (event, ui) {

            console.log(ui.draggable.attr('id'));
        }

    });

    function createHtml(src, id) {
        return $("<div class='view' id='" + id + "'>" +
            "<div class='viewParent'>" +
            "<div class='viewControls'>" +
            "<div class='buttonsGroup left'>" +
            "<div class='button back'>" +
            "<button>PREV</button>" +
            "</div>" +
            "<div class='button forward'>" +
            "<button>NEXT</button>" +
            "</div>" +
            "<div class='searchBar'>" +
            "<input type='text' class='addressInput' />" +
            "<div class='button reload'>" +
            "<button>REFRESH</button>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div class='buttonsGroup right'>" +
            "<div class='handle move'>" +
            "<i>MOVE</i>" +
            "</div>" +
            "<div class='button close'>" +
            "<button>CLOSE</button>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div class='viewContainer'>" +
            "<webview class='webview' src='" + src + "' style='width:100%; height:100%;'></webview>" +
            "</div>" +
            "</div>");
    }
}

WebViewElement.prototype.getHtml = function() {
    return this.domElement;
};

WebViewElement.prototype.goForward = function() {
    this.webViewElement.forward();
};

WebViewElement.prototype.goBack = function() {
    this.webViewElement.back();
};

WebViewElement.prototype.openUrl = function(url) {
    this.webViewElement.src = url;
};

WebViewElement.prototype.reloadPage = function() {
    this.webViewElement.reload();
};

WebViewElement.prototype.closePage = function() {
    removeView($(this.domElement).attr("id"));
};

WebViewElement.prototype.hideMenu = function() {
    $(this.controlsElement).css("top", "-30px");
    $(this.viewContainerElement).css("top", "0");
};

WebViewElement.prototype.showMenu = function() {
    $(this.controlsElement).css("top", "0");
    $(this.viewContainerElement).css("top", "30px");
};

