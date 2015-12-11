var keyboard = require('keyboardjs');
var _ = require('lodash');
var mainWidthRatio = 0.6;

function getActiveDesktop() {
    return document.querySelector('.desktop.active');
}

function getDesktops() {
    return Array.prototype.slice.call(document.querySelectorAll('.desktop'));
}

function updateTileDimensions() {
    desktop = getActiveDesktop();
    if (desktop.childNodes.length) {
        var header = document.querySelector('header');
        var availableWidth = document.body.offsetWidth;
        var availableHeight = document.body.offsetHeight - header.offsetHeight;
        var tiles = desktop.childNodes;
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
}

function closeTile(tile) {
    //TODO Remove this once the following issue has been resolved:
    // https://github.com/atom/electron/issues/1929
    tile.send('unload');
    tile.parentElement.removeChild(tile);
    updateTileDimensions();
}

function addTile() {
    var node = document.createElement('WEBVIEW');
    var desktop = getActiveDesktop();
    node.setAttribute('src', 'file:///Users/tbo/git/novashell/apps/term/index.html');
    node.setAttribute('class', 'tile');
    node.setAttribute('nodeintegration', '');
    desktop.insertBefore(node, desktop.firstChild);
    node.addEventListener('console-message', function(e) {
        console.log('DEBUG:', e.message);
    });
    node.addEventListener('close', function() {
        closeTile(node);
    });
    node.addEventListener('mouseover', function () {
        node.focus();
    });
    node.addEventListener('focus', function () {
        node.classList.add('focus');
    });
    node.addEventListener('blur', function () {
        node.classList.remove('focus');
    });
    updateTileDimensions();
    node.focus();
}

function showDesktop(index) {
    getActiveDesktop().classList.remove('active');
    getDesktops()[index].classList.add('active');
    updateTileDimensions();
}

function addDesktop(name) {
    var desktop = document.createElement('DIV');
    desktop.classList.add('desktop');
    if (!getActiveDesktop()) {
        desktop.classList.add('active');
    }
    document.querySelector('main').appendChild(desktop);
    return desktop;
}

window.addEventListener('load', function () {
    addDesktop('terminals');
    addDesktop('web');
});

window.addEventListener('unload', function () {
    Array.prototype.slice.call(document.querySelectorAll('.tile')).forEach(closeTile);
});

window.addEventListener('resize', _.throttle(updateTileDimensions, 100));

keyboard.bind('command + enter', function(e) {
    e.preventDefault();
    keyboard.releaseKey('enter');
    addTile();
});

keyboard.bind('command + 5', function(e) {
    e.preventDefault();
    keyboard.releaseKey('5');
    showDesktop(0);
});

keyboard.bind('command + 6', function(e) {
    e.preventDefault();
    keyboard.releaseKey('6');
    showDesktop(1);
});
