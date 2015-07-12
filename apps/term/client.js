var Terminal = require('term.js');
var remote = require('remote');
var Pty = remote.require('./apps/term/pty');
var _ = require('lodash');

var pty = null;
var term = null;
var charWidth = null;
var charHeight = null;

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

    function write(string) {
        term.write(string);
    }

    term = new Terminal({
        columns: columns,
        rows: rows//,
        // screenKeys: true
    });

    term.open(document.body);

    pty = new Pty(write, columns, rows);

    // term.dom(document.getElementById('console')).pipe({
    //     on: function(input) { console.log('TEST', input);},
    //     once: function(input) { console.log('TEST', input);},
    //     write: function(input) {pty.write(input.toString()); },
    //     emit: function(input) { console.log('TEST', input);}
    // });
    term.on('key', function (key, event) {
        if (event.type !== 'keypress' || event.keyCode !== 13) {
            pty.write(key);
        }
    });
}

function resize() {
    var columns = getColumnCount();
    var rows = getRowCount();
    term.resize(columns, rows);
    pty.resize(columns, rows);
}

window.addEventListener('resize', _.throttle(resize, 500));

window.addEventListener('load', function () {
    detectCharDimensions();
    createTerminalWindow();
    resize();
});
