var childProcess = require('child_process');
var gitHelpers = require('./git_helpers');

function Cache(cacheConfig) {
    console.log('Got cache config', cacheConfig);
    this.cacheConfig = cacheConfig;
    return this;
}

Cache.prototype.installModule = function installModule(user, moduleName, semver, installDir, callback) {
    var self = this;
    gitHelpers.exists(user, moduleName, self.cacheConfig.dir, function(moduleExists) {
        if (moduleExists) {
            gitHelpers.update(user, moduleName, self.cacheConfig.dir, function update(err) {
                if (err) return callback(err);
                self.copyModule(user, moduleName, semver, installDir, callback);
            });
        } else {
            gitHelpers.clone(user, moduleName, self.cacheConfig.dir, function clone(err) {
                if (err) return callback(err);
                self.copyModule(user, moduleName, semver, installDir, callback);
            });
        }
    });
};

Cache.prototype.copyModule = function copyModule(user, moduleName, semver, installDir, callback) {
    var self = this;
    gitHelpers.exists(user, moduleName, self.cacheConfig.dir, function(moduleExists) {
        if (!moduleExists) return callback(new Error('Cache does not have desired module somehow. WTF!?'));
        gitHelpers.findShaForVersion(user, moduleName, self.cacheConfig.dir, semver, function(err, sha) {
            if (err) return callback(err);
            gitHelpers.checkout(user, moduleName, self.cacheConfig.dir, sha, function checkedOut(err) {
                if (err) return callback(err);
                // TODO: Replace this with something built on `fs` and cross-platform
                var fromDir = self.cacheConfig.dir + '/' + user + '/' + moduleName;
                var toDir = installDir + '/' + moduleName;
                childProcess.exec('cp -r ' + fromDir + ' ' + installDir, {}, function(err) {
                    if (err) return callback(err);
                    childProcess.exec('rm -rf ' + toDir + '/.git', {}, function(err) {
                        if (err) return callback(err);
                        callback();
                    });
                });
            });
        });
    });
};
module.exports = Cache;
