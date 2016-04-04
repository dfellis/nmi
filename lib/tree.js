var fs = require('fs');

function Tree(cache, rootDir) {
    this.cache = cache;
    this.rootDir = rootDir;
    return this;
}

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

Tree.asyncForEach = function asyncForEach(arr, iterator, callback) {
    var len = arr.length;
    var cur = 0;
    function iterWrapper() {
        if (cur == len) return callback();
        iterator(arr[cur], cur, arr, function(err) {
            if (err) return callback(err);
            cur++;
            iterWrapper();
        });
    }
    iterWrapper();
};

Tree.prototype.buildDependencyTree = function buildDependencyTree(tree, callback) {
    var self = this;
    if (tree.children.length === 0) return callback(null, tree);
    Tree.asyncForEach(tree.children, function(child, index, children, next) {
        var childRoot = self.rootDir + '/node_modules/' + child.moduleName;
        var childTree = new Tree(self.cache, childRoot);
        self.cache.installModule(child.user, child.moduleName, child.version, childRoot, function(err) {
            if (err) return next(err);
            // TODO: Support dev-of-dev dependency resolution
            childTree.resolveDependencyTree('', function(err, resolvedTree) {
                if (err) return next(err);
                child.children = resolvedTree.children;
                next();
            });
        });
    }, function(err) {
        if (err) return callback(err);
        callback(null, tree);
    });
};

module.exports = Tree;
