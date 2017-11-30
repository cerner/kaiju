import configureApp from './appConfig';

const path = require('path');
// const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const code = require('./service/controllers/code');
const ManifestPlugin = require('webpack-manifest-plugin');
// const configure = require('./appConfig');

const config = {
  // context: path.resolve(__dirname, 'app'),

  entry: {
    code: './client/views/code',
    component: './client/views/component',
    // preview: './routes/preview',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new ManifestPlugin({
      writeToFileEmit: true,
    }),
  ],

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name]-[hash].js',
    publicPath: '/',
  },

  devServer: {
    setup: (app) => {
      configureApp(app);
    },
  },

  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = config;
