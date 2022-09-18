const path = require("path");
const { whenProd } = require("@craco/craco");
const HtmlCriticalWebpackPlugin = require("html-critical-webpack-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      return {
        ...webpackConfig,
        plugins: [
          ...webpackConfig.plugins,
          ...whenProd(
            () => [
              new HtmlCriticalWebpackPlugin({
                base: path.resolve(__dirname, "build"),
                src: "index.html",
                dest: "index.html",
                inline: true,
                minify: true,
                extract: true,
                penthouse: {
                  blockJSRequests: false
                }
              })
            ],
            []
          )
        ]
      };
    }
  }
};
