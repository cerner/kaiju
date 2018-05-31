const webpack = require('webpack');
const path = require('path');
const theme = require('./themes/default');

const resolve = path.resolve;

const I18nAggregatorPlugin = require('terra-i18n-plugin');
const i18nSupportedLocales = require('terra-i18n/lib/i18nSupportedLocales');

const Autoprefixer = require('autoprefixer');
const CustomProperties = require('postcss-custom-properties');
const GatherDependencies = require('./plugins/gather-dependencies');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const merge = require('webpack-merge');

const configPath = resolve('..', 'config');
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');

const { output } = webpackConfigLoader(configPath);

const config = {
  mode: 'development',
  devtool: 'eval-source-map',
  context: resolve(__dirname),

  entry: {
    attributes: ['babel-polyfill', './app/bundles/kaiju/startup/attributesRegistration'],
    code: ['babel-polyfill', './app/bundles/kaiju/startup/codeRegistration'],
    component: ['babel-polyfill', './app/bundles/kaiju/startup/componentRegistration'],
    guide: ['babel-polyfill', './app/bundles/kaiju/startup/guideRegistration'],
    launch: ['babel-polyfill', './app/bundles/kaiju/startup/launchPageRegistration'],
    preview: ['babel-polyfill', './app/bundles/kaiju/startup/previewRegistration'],
    project: ['babel-polyfill', './app/bundles/kaiju/startup/projectRegistration'],
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
    new MiniCssExtractPlugin({
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
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins() {
                return [
                  Autoprefixer,
                  CustomProperties({ warnings: false }),
                ];
              },
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
      {
        test: /\.(scss|css)$/,
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
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins() {
                return [
                  Autoprefixer,
                  CustomProperties({ warnings: false }),
                ];
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
};

const prodConfig = {
  mode: 'production',
  devtool: undefined,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
};

module.exports = process.env.NODE_ENV === 'development' ? config : merge(config, prodConfig);
