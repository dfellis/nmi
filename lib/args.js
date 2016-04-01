// This will clearly be improved in the future when we need a real arg parser

var args = module.exports = {};

process.argv.forEach(function(arg) {
    if (arg === 'install' || args === 'i') {
        args.install = true;
    } else if (arg === 'audit' || args === 'a') {
        args.audit = true;
        console.error('not yet implemented, sorry');
        process.exit(4);
    } else if (arg === '-g') {
        args.global = true;
        console.error('lol, did I say you can install globally? actually, you can\'t yet, sorry');
        process.exit(1337);
    } else if (arg === '-u') {
        args.userLevel = true;
    } else if (arg === '-d') {
        args.dev = true;
    } else if (arg === '-dd') {
        args.dev = true;
        args.all_dev = true;
    } else if (arg === '-f') {
        args.force = true;
    } else if (arg === '--help' || arg === '-h') {
        console.log('nmi - Node Module Installer');
        console.log('Usage:');
        console.log('');
        console.log('nmi (audit|install) [-g] [-u] [-d[d]]');
        console.log('audit   -- Audit the dependencies of this package for security vulnerabilities');
        console.log('install -- Install this package');
        console.log('-g      -- Install this package globally');
        console.log('-u      -- Install this package for this user (assumes ~/bin exists and is on the PATH)');
        console.log('-d      -- Install the dev dependencies of this package');
        console.log('-dd     -- Install the dev dependencies of every dependency too (madness!)');
        console.log('-f      -- Force the install');
        console.log('No args -- Install this package locally');
        process.exit(0);
    }
});

if (args.global && args.userLevel) {
    // lolwut
    // Switch to userLevel install instead of global
    // as someone making this silly mistake probably
    // doesn't know the difference between the two
    delete args.global;
}
