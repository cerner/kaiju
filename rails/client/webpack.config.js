const webpack = require('webpack');
const path = require('path');

const resolve = path.resolve;

const I18nAggregatorPlugin = require('terra-i18n-plugin');
const i18nSupportedLocales = require('terra-i18n/lib/i18nSupportedLocales');

const Autoprefixer = require('autoprefixer');
const CustomProperties = require('postcss-custom-properties');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const GatherDependencies = require('./plugins/gather-dependencies');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');

const configPath = resolve('..', 'config');
const { output } = webpackConfigLoader(configPath);

const config = {

  context: resolve(__dirname),

  entry: {
    attributes: './app/bundles/kaiju/startup/attributesRegistration',
    code: './app/bundles/kaiju/startup/codeRegistration',
    component: './app/bundles/kaiju/startup/componentRegistration',
    guide: './app/bundles/kaiju/startup/guideRegistration',
    launch: './app/bundles/kaiju/startup/launchPageRegistration',
    preview: [
      './app/bundles/kaiju/startup/previewRegistration',
      'babel-polyfill',
    ],
    project: './app/bundles/kaiju/startup/projectRegistration',
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
    new ManifestPlugin({ publicPath: output.publicPath, writeToFileEmit: true }),
    new I18nAggregatorPlugin({
      baseDirectory: __dirname,
      supportedLocales: i18nSupportedLocales,
    }),
    new webpack.NamedChunksPlugin(),
    new ExtractTextPlugin({
      filename: '[name]-[hash].css',
    }),
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
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 2,
                localIdentName: '[name]_[local]_[hash:base64:5]',
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
          ],
        }),
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
