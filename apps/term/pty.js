var childPty = require('child_pty');

module.exports = function (callback, columns, rows) {
    // var term = pty.spawn('bash', [], {
    //     name: 'xterm-color',
    //     cols: columns,
    //     rows: rows,
    //     cwd: process.env.HOME,
    //     env: process.env
    // });
    // term.on('data', function(data) {
    //     callback(data);
    // });
    var child = childPty.spawn('bash', [], {columns: columns, rows: rows});
    child.stdout.on('data', function (msg) {
        callback(msg.toString());
    });

    return {
        write: function (input) {
            child.stdin.write(input);
            // term.write(input);
        },
        resize: function(c, r) {
            child.stdout.resize({columns: c, rows: r});
            // term.resize(c, r);
        }
    };
};
