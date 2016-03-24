var fs = require('fs');

function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}

module.exports = {
    load: function load() {
        var userHome = getUserHome();
        var nmircExists = fs.existsSync(userHome + "/.nmirc");
        if (!nmircExists) {
            console.log("No ~/.nmirc file found, creating default one");
            fs.writeFileSync(userHome + "/.nmirc", "{}", "utf8");
        }
        try {
            var nmirc = JSON.parse(fs.readFileSync(userHome + "/.nmirc", "utf8"));
            return nmirc;
        } catch (e) {
            console.err("Failed to read ~/.nmirc", e);
            process.exit(1);
        }
    }
};
