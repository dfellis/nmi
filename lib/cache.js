// TODO: Make this work

module.exports = function Cache(cacheConfig) {
    console.log('Got cache config', cacheConfig);
    this.cacheConfig = cacheConfig;
    return this;
};
