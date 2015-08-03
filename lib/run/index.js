var Spawn = require("child_process").spawn
  , Fs = require("fs")
  ;

function Run(path, options, callback) {
    var p = Spawn(path, options.args)
      , err = ""
      , data = ""
      ;

    if (options.remove !== false) {
        Fs.unlink(path);
    }

    if (options.stdin) {
        options.stdin.pipe(p.stdin);
    }

    if (options.stdout) {
        p.stdout.pipe(options.stdout);
    } else {
        p.stdout.on("data", function (chunk) {
            data += chunk.toString();
        });
    }

    if (options.stderr) {
        p.stderr.pipe(options.stderr);
    } else {
        p.stderr.on("data", function (err) {
            err += err.toString();
        });
    }

    p.on("close", function () {
        callback([null, err][Number(!!err)], data.slice(0, -1));
    });
}

module.exports = Run;
