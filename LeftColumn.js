"use strict";

function LeftColumn() {
    var _this = this;
    _this.domElement = $("#leftBar");

    _this.nextOrientation = false;

    _this.buttons = {
        addPageButton: $(_this.domElement).find("#addPage"),
        reorganizeLayoutButton: $(_this.domElement).find("#reorganizeLayout"),
        clearAllButton: $(_this.domElement).find("#clearAll"),
        facebookButton: $(_this.domElement).find("#facebook"),
        redditButton: $(_this.domElement).find("#reddit"),
        spotifyButton: $(_this.domElement).find("#spotify"),
        twitterButton: $(_this.domElement).find("#twitter")
    };

    _this.buttons.addPageButton.click(function () {
        addNewViewFromLauncher("https://google.com");
        _this.nextOrientation = !_this.nextOrientation;
    });

    _this.buttons.reorganizeLayoutButton.click(function () {
        resetLayout();
    });

    _this.buttons.clearAllButton.click(function () {
        clearAll();
    });

    _this.buttons.facebookButton.click(function () {
        addNewViewFromLauncher("https://facebook.com");
    });

    _this.buttons.redditButton.click(function () {
        addNewViewFromLauncher("https://reddit.com");
    });
    _this.buttons.spotifyButton.click(function () {
        addNewViewFromLauncher("https://spotify.com");
    });
    _this.buttons.twitterButton.click(function () {
        addNewViewFromLauncher("https://twitter.com");
    });
}

var leftColumn = new LeftColumn();