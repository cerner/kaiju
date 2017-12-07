// For inspiration on your webpack configuration, see:
// https://github.com/shakacode/react_on_rails/tree/master/spec/dummy/client
// https://github.com/shakacode/react-webpack-rails-tutorial/tree/master/client

const webpack = require('webpack');
const path = require('path');

const resolve = path.resolve;

const I18nAggregatorPlugin = require('terra-i18n-plugin');
const i18nSupportedLocales = require('terra-i18n/lib/i18nSupportedLocales');

const Autoprefixer = require('autoprefixer');
const CustomProperties = require('postcss-custom-properties');
const GatherDependencies = require('./plugins/gather-dependencies');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');

const configPath = resolve('..', 'config');
const { output } = webpackConfigLoader(configPath);

const threadLoaderRule = {
  loader: 'thread-loader',
  options: {
    workerParallelJobs: 50,
    poolParallelJobs: 50,
    poolTimeout: 2000,
  },
};

const config = {

  context: resolve(__dirname),

  entry: {
    attributes: './app/bundles/Kaiju/startup/attributesRegistration',
    code: './app/bundles/Kaiju/startup/codeRegistration',
    component: './app/bundles/Kaiju/startup/componentRegistration',
    launch: './app/bundles/Kaiju/startup/launchPageRegistration',
    preview: [
      './app/bundles/Kaiju/startup/previewRegistration',
      'babel-polyfill',
    ],
    project: './app/bundles/Kaiju/startup/projectRegistration',
  },

  output: {
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].chunk.js',
    publicPath: output.publicPath,
    path: output.path,
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'aggregated-translations'), 'node_modules'],
  },

  resolveLoader: {
    modules: [path.resolve(path.join(__dirname, 'node_modules'))],
  },

  plugins: [
    new GatherDependencies(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    // new webpack.EnvironmentPlugin({
    //   NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
    //   DEBUG: false,
    // }),
    new ManifestPlugin({ publicPath: output.publicPath, writeToFileEmit: true }),
    new I18nAggregatorPlugin({
      baseDirectory: __dirname,
      supportedLocales: i18nSupportedLocales,
    }),
    new webpack.NamedChunksPlugin(),
    // new webpack.optimize.UglifyJsPlugin({ sourceMap: true, minimize: true }),
  ],

  module: {
    rules: [
      {
        test: require.resolve('react'),
        use: {
          loader: 'imports-loader',
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          !process.env.CI && threadLoaderRule,
          'babel-loader',
        ].filter(Boolean),
      },
      {
        test: /\.(scss|css)$/,
        use: [
          !process.env.CI && threadLoaderRule,
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  Autoprefixer({
                    browsers: [
                      'ie >= 10',
                      'last 2 versions',
                      'last 2 android versions',
                      'last 2 and_chr versions',
                      'iOS >= 8',
                    ],
                  }),
                  CustomProperties(),
                ];
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ].filter(Boolean),
      },
    ],
  },
};

module.exports = config;

if (process.env.NODE_ENV === 'development') {
  console.log('Webpack dev build for Rails'); // eslint-disable-line no-console
  module.exports.devtool = 'eval-source-map';
} else {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({ sourceMap: true, minimize: true }));
  console.log('Webpack production build for Rails'); // eslint-disable-line no-console
}
