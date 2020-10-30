const { merge } = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const terraWebpackConfig = require('@cerner/webpack-config-terra');

const appWebpackConfig = () => ({
  entry: {
    index: './src/application/index.jsx',
    sandbox: './src/sandbox/index.jsx',
  },
  plugins: [
    new HtmlWebpackPlugin({
      excludeChunks: ['sandbox'],
      filename: './index.html',
      template: './public/index.html',
    }),
    new HtmlWebpackPlugin({
      excludeChunks: ['index'],
      filename: './sandbox.html',
      template: './public/sandbox.html',
    }),
  ],
});

const mergedConfig = (env, argv) => (
  merge(terraWebpackConfig(env, argv), appWebpackConfig(env, argv))
);

module.exports = mergedConfig;
