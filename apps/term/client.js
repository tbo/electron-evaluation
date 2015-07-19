var Terminal = require('term.js');
var childPty = require('child_pty');
var _ = require('lodash');
var pty = null;
var terminalWindow = null;
var charWidth = null;
var charHeight = null;
var ipc = require('ipc');

var dimensionElement = document.createElement('span');
var dimensionText = document.createTextNode('MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM');
dimensionElement.appendChild(dimensionText);
dimensionElement.setAttribute('id', 'dimension-element');

function detectCharDimensions() {
    document.body.appendChild(dimensionElement);
    charWidth = dimensionElement.offsetWidth / 40;
    charHeight = dimensionElement.offsetHeight;
    document.body.removeChild(dimensionElement);
}

function getColumnCount() {
    return Math.floor(document.body.offsetWidth / charWidth);
}

function getRowCount() {
    return Math.floor(document.body.offsetHeight / charHeight);
}

function createTerminalWindow() {
    var columns = getColumnCount();
    var rows = getRowCount();

    terminalWindow = new Terminal({
        columns: columns,
        rows: rows//,
        // screenKeys: true
    });

    terminalWindow.open(document.body);

    pty = childPty.spawn('bash', [], {columns: columns, rows: rows});
    pty.stdout.on('data', function (msg) {
        terminalWindow.write(msg.toString());
    });

    pty.stdout.on('end', function () {
        window.close();
    });

    terminalWindow.on('key', function (key) {
        pty.stdin.write(key);
    });
}

function resize() {
    var columns = getColumnCount();
    var rows = getRowCount();
    terminalWindow.resize(columns, rows);
    pty.stdout.resize({columns: columns, rows: rows});
}

window.addEventListener('resize', _.throttle(resize, 500));

window.addEventListener('unload', function () {
    pty.kill('SIGHUP');
});
//TODO Remove this once the following issue is resolved:
// https://github.com/atom/electron/issues/1929
ipc.on('unload', function() {
    pty.kill('SIGHUP');
});

window.addEventListener('load', function () {
    detectCharDimensions();
    createTerminalWindow();
    resize();
});
