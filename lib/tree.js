var fs = require('fs');

function Tree(cache, rootDir) {
    this.cache = cache;
    this.rootDir = rootDir;
    return this;
}

Tree.prototype.installTree = function installTree(tree, callback) {
    // TODO: Fill me in
};

Tree.prototype.resolveDependencyTree = function resolveDependencyTree(type, callback) {
    var self = this;
    fs.readFile(self.rootDir + '/package.json', 'utf8', function(err, json) {
        if (err) return callback(err);
        var rootPackageJson;
        try {
            rootPackageJson = JSON.parse(json);
        } catch(e) {
            return callback(e);
        }
        var dependencies;
        if (type === 'dev') {
            dependencies = rootPackageJson.devDependencies;
        } else {
            dependencies = rootPackageJson.dependencies;
        }
        var rootNode = {
            user: 'dontcare',
            moduleName: 'dontcare',
            version: 'dontcare',
            children: []
        };
        Object.keys(dependencies).forEach(function(userPlusModuleName) {
            // TODO: Add support for "legacy" module declarations
            var userPlusModuleNameArr = userPlusModuleName.split('/');
            var child = {
                user: userPlusModuleNameArr[0],
                moduleName: userPlusModuleNameArr[1],
                version: dependencies[userPlusModuleName],
                children: []
            };
        });
        self.buildDependencyTree(rootNode, callback);
    });
};

Tree.prototype.buildDependencyTree = function buildDependencyTree(tree, callback) {
    var self = this;
    if (tree.children.length === 0) return callback(tree);
    // TODO: Fill in the rest of this
};

module.exports = Tree;
