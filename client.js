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
    mainTile.style.width = availableWidth * (tiles.length > 1 ? mainWidthRatio : 1) + 'px';
    for(var i = 1; i < tiles.length; i += 1) {
        tiles[i].style.height = stackedTileHeight;
        tiles[i].style.width = stackedTileWidth;
    }

    if (tiles.length > 2) {
        tiles[tiles.length - 1].style.height = remainingHeight;
    }
}

function closeTile(tile) {
    //TODO Remove this once the following issue is resolved:
    // https://github.com/atom/electron/issues/1929
    tile.send('unload');
    tile.parentElement.removeChild(tile);
}

function addTile() {
    var node = document.createElement('WEBVIEW');
    var desktop = desktops[currentDesktopIndex];
    node.setAttribute('src', 'file:///Users/tbo/git/novashell/apps/term/index.html');
    node.setAttribute('class', 'tile');
    node.setAttribute('nodeintegration', '');
    desktop.insertBefore(node, desktop.firstChild);
    node.addEventListener('console-message', function(e) {
        console.log('DEBUG:', e.message);
    });
    node.addEventListener('close', function() {
        console.log('close');
        closeTile(node);
    });
    updateTileDimensions();
}

function switchDesktop(index) {
}

window.addEventListener('load', function () {
    updateDesktops();
});

window.addEventListener('resize', _.throttle(onResize, 100));

keyboard.bind('command + enter', function(e) {
    addTile();
});
