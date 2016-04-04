var fs = require('fs');
var childProcess = require('child_process');

module.exports = function install(args, tree, buildConfig) {
    if (args.userLevel) {
        moveToUserBuilds(args, tree, buildConfig, actuallyInstall);
    } else {
        actuallyInstall(args, tree, buildConfig);
    }
};

function moveToUserBuilds(args, tree, buildConfig, callback) {
    var projectDir = tree.rootDir;
    var projectName = projectDir.match(/([^\/]*$)/)[1];
    var buildDir = buildConfig.dir + '/' + projectName;
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir);
    } else {
        if (args.force) {
            return childProcess.exec('rm -rf ' + buildDir, {}, function(err) {
                if (err) return console.error(err);
                fs.mkdirSync(buildDir);
                copyBuildData(args, tree, buildConfig, callback);
            });
        } else {
            console.log(projectName + ' already installed locally, exiting');
            process.exit(5);
        }
    }
    copyBuildData(args, tree, buildConfig, callback);
}

function copyBuildData(args, tree, buildConfig, callback) {
    var projectDir = tree.rootDir;
    var projectName = projectDir.match(/([^\/]*$)/)[1];
    var buildDir = buildConfig.dir + '/' + projectName;
    childProcess.exec('cp -r . ' + buildDir, {
        cwd: tree.rootDir
    }, function(err) {
        if (err) return console.error(err);
        childProcess.exec('rm -rf .git', {
            cwd: buildDir
        }, function(err) {
            if (err) return console.error(err);
            tree.rootDir = buildDir;
            callback(args, tree, buildConfig);
        });
    });
}

function actuallyInstall(args, tree, buildConfig) {
    if (args.dev) {
        console.log('Installing dev dependencies...');
        tree.resolveDependencyTree('dev', function(err) {
            if (err) throw err;
            console.log('Done!');
        });
    } else if (args.allDev) {
        console.error('Recursive dependency installation not yet supported');
        process.exit(6);
    } else {
        console.log('Installing dependencies...');
        tree.resolveDependencyTree('', function(err) {
            if (err) throw err;
            console.log('Done!');
        });
    }
}
