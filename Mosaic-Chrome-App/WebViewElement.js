"use strict";

var currentDisplayedNavbar = null;

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
        dragHandleElement : $(_this.controlsElement).find(".move"),
    };
    _this.loadElement =  $(_this.domElement).find(".loader");
    _this.viewContainerElement = $(_this.domElement).find(".viewContainer");

    //_this.webViewElement.setUserAgentOverride("Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25");

    _this.isLoading = false;

    $(_this.domElement).bind('mousewheel', onMouseWheel);
    //$(_this.domElement).mouseleave(function() {_this.hideMenu();});

    $(_this.controls.backButton).click(function() {_this.goBack();});
    $(_this.controls.forwardButton).click(function() {_this.goForward();});
    $(_this.controls.reloadButton).click(function() {_this.reloadPage();});
    $(_this.controls.closeButton).click(function() {_this.closePage();});

    //_this.webViewElement.addEventListener('exit', handleExit);
    _this.webViewElement.addEventListener('loadstart', handleLoadStart);
    _this.webViewElement.addEventListener('loadstop', handleLoadStop);
    //_this.webViewElement.addEventListener('loadabort', handleLoadAbort);
    _this.webViewElement.addEventListener('loadredirect', handleLoadRedirect);
    _this.webViewElement.addEventListener('loadcommit', handleLoadCommit);

    function handleLoadCommit(event) {
        //resetExitedState();
        if (!event.isTopLevel) {
            return;
        }

        $(_this.controls.addressInputBar).val(event.url);

        if (_this.webViewElement.canGoBack()) {
            $(_this.controls.backButton).removeClass("disabled");
        } else {
            $(_this.controls.backButton).addClass("disabled");
        }

        if (_this.webViewElement.canGoForward()) {
            $(_this.controls.forwardButton).removeClass("disabled");
        } else {
            $(_this.controls.forwardButton).addClass("disabled");
        }
        //closeBoxes();
    }

    function handleLoadStart(event) {
        _this.isLoading = true;
        _this.loadElement.css("height", "6px");

        //resetExitedState();
        if (!event.isTopLevel) {
            return;
        }

        $(_this.controls.addressInputBar).val(event.url);
    }

    function handleLoadRedirect(event) {
        //resetExitedState();
        if (!event.isTopLevel) {
            return;
        }

        $(_this.controls.addressInputBar).val(event.newUrl);
    }

    function handleLoadStop(event) {
        _this.isLoading = false;
        _this.loadElement.css("height", 0);
    }

    $(_this.controls.addressInputBar).keypress(function(event) {
        if (event.keyCode == 13) {
            var string = _this.controls.addressInputBar.val();
            if(isUrl(string)) {
                _this.openUrl(string);
            } else {
                _this.openUrl("https://www.google.co.uk/search?q=" + string);
            }
        }
    });

    $(_this.controls.dragHandleElement).on("dragstart", function () {
        event.dataTransfer.setData('htmlid', $(_this.domElement).attr("id"));
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

    function createHtml(src, id) {
        return $("<div class='view' id='" + id + "'>" +
            "<div class='viewParent'>" +
            "<div class='viewControls'>" +
            "<div class='buttonsGroup left'>" +
            "<div class='button back'>" +
            "<i><img src='images/icons/Icon_Back.png'></i>" +
            "</div>" +
            "<div class='button forward'>" +
            "<i><img src='images/icons/Icon_Forward.png'></i>" +
            "</div>" +
            "<input type='text' class='addressInput' placeholder='Type an url...' />" +
            "<div class='button reload'>" +
            "<i><img src='images/icons/Icon_Refresh.png'></i>" +
            "</div>" +
            "</div>" +
            "<div class='buttonsGroup right'>" +
            "<div class='handle move' draggable='true'>" +
            "<i><img src='images/icons/Icon_Move.png'></i>" +
            "</div>" +
            "<div class='button close'>" +
            "<i><img src='images/icons/Icon_Close.png'></i>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div class='viewContainer'>" +
            "<webview class='webview' partition='persist:mosaic' src='" + src + "' style='width:100%; height:100%;'></webview>" +
            "</div>" +
            "<div class='loader'><div class='bar'></div><div class='bar'></div><div class='bar'></div></div>" +
            "</div>");
    }
}

WebViewElement.prototype.getHtml = function() {
    return this.domElement;
};

WebViewElement.prototype.changeId = function(newId) {
    $(this.domElement).attr("id", newId);
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
    $(this.controlsElement).css("top", "-50px");
    $(this.controlsElement).css("display", "none");
    $(this.viewContainerElement).css("top", "0");
    $(this.loadElement).css("top", "0");

};

WebViewElement.prototype.showMenu = function() {
    if (currentDisplayedNavbar !== null) {
        currentDisplayedNavbar.hideMenu();
    }
    currentDisplayedNavbar = this;
    $(this.controlsElement).css("top", "0");
    $(this.controlsElement).css("display", "block");
    $(this.viewContainerElement).css("top", "50px");
    $(this.loadElement).css("top", "50px");
};

