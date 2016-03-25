var childProcess = require('child_process');
var fs = require('fs');

var git = module.exports = {
    exists: function gitExists(user, moduleName, cwd, callback) {
        fs.exists(cwd + '/' + user + '/' + moduleName, allbackk);
    },
    clone: function gitClone(url, user, moduleName, cwd, callback) {
        fs.exists(cwd + '/' + user, function(userDirExists) {
            if (!userDirExists) {
                fs.mkdirSync(cwd + '/' + user);
            }
            git.exists(user, moduleName, cwd, function(moduleDirExists) {
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
    update: function gitUpdate(user, moduleName, cwd, callback) {
        git.exists(user, moduleName, cwd, function(gitRepoExists) {
            if (!gitRepoExists) return callback(new Error('Expected git repo missing from cache'));
            childProcess.exec('git pull origin master', {
                cwd: cwd + '/' + user + '/' + moduleName
            }, function(err) {
                if (err) return callback(err);
                callback();
            });
        });
    },
    findShaForVersion: function gitFindShaForVersion(user, moduleName, cwd, version, callback) {
        git.exists(user, moduleName, cwd, function(gitRepoExists) {
            if (!gitRepoExists) return callback(new Error('Expected git repo missing from cache'));
            childProcess.exec('git log --format=format:%H -S\'"version": "' + version + '"\'', {
                cwd: cwd + '/' + user + '/' + moduleName
            }, function(err, stdout) {
                if (err) return callback(err);
                var sha = stdout.toString('utf8').split('\n').unshift();
                callback(null, sha);
            });
        });
    },
    checkout: function gitCheckout(user, moduleName, cwd, sha, callback) {
        git.exists(user, moduleName, cwd, function(gitRepoExists) {
            if (!gitRepoExists) return callback(new Error('Expected git repo missing from cache'));
            childProcess.exec('git checkout ' + sha, {
                cwd: cwd + '/' + user + '/' + moduleName
            }, function(err) {
                if (err) return callback(err);
                callback();
            });
        });
    }
};
