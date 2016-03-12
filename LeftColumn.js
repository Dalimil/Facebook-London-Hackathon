"use strict";

function LeftColumn() {
    var _this = this;
    _this.domElement = $("#leftBar");

    _this.nextOrientation = false;

    _this.buttons = {
        addPageButton: $(_this.domElement).find("#addPage"),
        reorganizeLayoutButton: $(_this.domElement).find("#reorganizeLayout")
    };

    _this.buttons.addPageButton.click(function () {
        addNewView("webview-id-1", "https://google.com", _this.nextOrientation);
        _this.nextOrientation = !_this.nextOrientation;
    });

    _this.buttons.reorganizeLayoutButton.click(function () {
        resetLayout();
    });
}

var leftColumn = new LeftColumn();