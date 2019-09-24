const defaultWebpackConfig = require('terra-toolkit/config/webpack/webpack.config');
const merge = require('webpack-merge');
const path = require('path');
const theme = require('./themes/default');
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');
const GatherDependencies = require('./plugins/gather-dependencies');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const resolve = path.resolve;
const configPath = resolve('..', 'config');
const { output } = webpackConfigLoader(configPath);

const config = {
  entry: {
    attributes: './app/bundles/kaiju/startup/attributesRegistration',
    code: './app/bundles/kaiju/startup/codeRegistration',
    component: './app/bundles/kaiju/startup/componentRegistration',
    guide: './app/bundles/kaiju/startup/guideRegistration',
    launch: './app/bundles/kaiju/startup/launchPageRegistration',
    preview: './app/bundles/kaiju/startup/previewRegistration',
    project: './app/bundles/kaiju/startup/projectRegistration',
  },
  output: {
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].chunk.js',
    publicPath: output.publicPath,
    path: output.path,
  },
  plugins: [
    new GatherDependencies(),
    new ManifestPlugin({ publicPath: output.publicPath, writeToFileEmit: true }),
  ],
  module: {
    rules: [
      {
        test: /\.(less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
              localIdentName: '[name]_[local]_[hash:base64:5]',
            },
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: theme,
            },
          },
        ],
      },
    ],
  },
};

module.exports = (env, argv) => (
  merge(defaultWebpackConfig(env, argv), config)
);
