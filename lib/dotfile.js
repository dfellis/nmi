var fs = require('fs');

function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}

module.exports = {
    load: function load() {
        var userHome = getUserHome();
        var nmircExists = fs.existsSync(userHome + '/.nmirc');
        if (!nmircExists) {
            console.log('No ~/.nmirc file found, creating default one');
            fs.writeFileSync(userHome + '/.nmirc', JSON.stringify({
                cache: {
                    dir: userHome + '/.nmi/cache',
                    urlTemplates: [
                        'git@github.com:${user}/${module}'
                    ],
                    legacyPackages: true
                }
            }, undefined, '    '), 'utf8');
            // Also check if ~/.nmi doesn't exist and initialize
            var nmidirExists = fs.existsSync(userHome + '/.nmi');
            if (!nmidirExists) {
                console.log('No ~/.nmi directory found, creating default one');
                fs.mkdirSync(userHome + '/.nmi');
                fs.mkdirSync(userHome + '/.nmi/cache');
            }
        }
        try {
            var nmirc = JSON.parse(fs.readFileSync(userHome + '/.nmirc', 'utf8'));
            return nmirc;
        } catch (e) {
            console.err('Failed to read ~/.nmirc', e);
            process.exit(1);
        }
    }
};
