var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var chokidar = require('chokidar');
var watcher = chokidar.watch(__dirname, {ignored: /^\./, persistent: true});
var path = require('path');
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit();
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    mainWindow = new BrowserWindow({width: 1024, height: 768});
    // mainWindow.openDevTools();
    watcher.on('change', function () {
        mainWindow.reload();
    });
    // and load the index.html of the app.
    mainWindow.loadUrl(path.join('file://', __dirname, '/index.html'));
    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
