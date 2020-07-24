const { merge } = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const toolkitWebpackConfig = require('terra-toolkit/config/webpack/webpack.config');

const appWebpackConfig = () => ({
  entry: {
    index: './src/index.jsx',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './public/index.html',
    }),
  ],
});

const mergedConfig = (env, argv) => {
  const config = merge(toolkitWebpackConfig(env, argv), appWebpackConfig(env, argv));

  // This is required to bundle the web compatible octokit/rest.
  config.resolve.mainFields = ['browser', 'module', 'main'];

  return config;
};

module.exports = mergedConfig;
