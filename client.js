var keyboard = require('keyboardjs');
var _ = require('lodash');
var currentDesktopIndex = 0;
var desktops = null;
var mainWidthRatio = 0.6;

function updateDesktops() {
    desktops = document.querySelectorAll('main > .desktop');
}

function onResize() {
    if (desktops[currentDesktopIndex].childNodes.length) {
        updateTileDimensions();
    }
}

function updateTileDimensions() {
    var header = document.querySelector('header');
    var availableWidth = document.body.offsetWidth;
    var availableHeight = document.body.offsetHeight - header.offsetHeight;
    var tiles = desktops[currentDesktopIndex].childNodes;
    var mainTile = tiles[0];
    var stackedTileHeight = Math.ceil(availableHeight / (tiles.length - 1)) + 'px';
    var stackedTileWidth = availableWidth * (1 - mainWidthRatio) + 'px';
    var remainingHeight = availableHeight - (Math.ceil(availableHeight / (tiles.length - 1)) * (tiles.length - 2)) + 'px';
    mainTile.style.height = availableHeight + 'px';
    mainTile.style.width = availableWidth * mainWidthRatio + 'px';
    for(var i = 1; i < tiles.length; i += 1) {
        tiles[i].style.height = stackedTileHeight;
        tiles[i].style.width = stackedTileWidth;
    }

    if (tiles.length > 2) {
        tiles[tiles.length - 1].style.height = remainingHeight;
    }
}

function addTile() {
    var node = document.createElement("WEBVIEW");
    node.setAttribute('src', 'file:///Users/tbo/git/novashell/apps/term/index.html');
    node.setAttribute('class', 'tile');
    node.setAttribute('nodeintegration', '');
    // var textnode = document.createTextNode("Water");
    // node.appendChild(textnode);
    desktops[currentDesktopIndex].appendChild(node);
    // desktops[currentDesktopIndex].appendChild(document.querySelector('template').content);
    updateTileDimensions();
}

function switchDesktop(index) {
}

window.addEventListener('load', function () {
    updateDesktops();
    // var mywebview = document.getElementById('term');
    // mywebview.addEventListener("dom-ready", function(){
        // mywebview.openDevTools();
    // });
});

window.addEventListener('resize', _.throttle(onResize, 500));

keyboard.bind('command + enter', function(e) {
    addTile();
});
