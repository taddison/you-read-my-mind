module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    const appTarget = process.env.APP_TARGET || "faunaDb";

    config.plugins.push(new webpack.NormalModuleReplacementPlugin(
      /(.*)APP_TARGET(\.*)/,
      function(resource) {
        resource.request = resource.request.replace(
          /APP_TARGET/,
          `${appTarget}`
        );
      }
    ));
    
    return config;
  },
};
