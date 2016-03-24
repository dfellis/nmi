// This will clearly be improved in the future when we need a real arg parser

var args = module.exports = {};

process.argv.forEach(function(arg) {
    if (arg === 'install') {
        args.install = true;
    } else if (arg === '-g') {
        args.global = true;
    } else if (arg === '-u') {
        args.user_level = true;
    }
});

if (args.global && args.user_level) {
    // lolwut
    // Switch to user_level install instead of global
    // as someone making this silly mistake probably
    // doesn't know the difference between the two
    delete args.global;
}
