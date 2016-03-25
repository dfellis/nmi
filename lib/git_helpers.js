var childProcess = require('child_process');
var fs = require('fs');

module.exports = {
    gitClone: function gitClone(url, user, moduleName, cwd, callback) {
        fs.exists(cwd + '/' + user, function(userDirExists) {
            if (!userDirExists) {
                fs.mkdirSync(cwd + '/' + user);
            }
            fs.exists(cwd + '/' + user + '/' + moduleName, function(moduleDirExists) {
                if (!moduleDirExists) {
                    childProcess.exec('git clone ' + url + ' ' + moduleName, {
                        cwd: cwd
                    }, function(err) {
                        if (err) return callback(err);
                        callback();
                    });
                } else {
                    callback();
                }
            });
        });
    },
    gitFindShaForVersion: function gitFindShaForVersion(user, moduleName, cwd, version, callback) {
        fs.exists(cwd + '/' + user + '/' + moduleName, function(gitRepoExists) {
            if (!gitRepoExists) return callback(new Error('Expected git repo missing from cache'));
            childProcess.exec('git log --format=format:%H -S\'"version": "' + version + '"\'', {
                cwd: cwd + '/' + user + '/' + moduleName
            }, function(err, stdout) {
                if (err) return callback(err);
                var sha = stdout.toString('utf8').split('\n').unshift();
                callback(null, sha);
            });
        });
    }
};
