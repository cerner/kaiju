const aggregateTranslations = require('terra-toolkit/scripts/aggregate-translations/aggregate-translations.js');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const rtl = require('postcss-rtl');
const theme = require('./themes/default');
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');

const Autoprefixer = require('autoprefixer');
const CustomProperties = require('postcss-custom-properties');
const GatherDependencies = require('./plugins/gather-dependencies');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const resolve = path.resolve;
const configPath = resolve('..', 'config');
const { output } = webpackConfigLoader(configPath);

aggregateTranslations({ baseDirectory: __dirname });

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
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].css',
    }),
    new PostCSSAssetsPlugin({
      test: /\.css$/,
      log: false,
      plugins: [
        CustomProperties(),
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
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
                  Autoprefixer(),
                  CustomProperties(),
                  rtl(),
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
                  Autoprefixer(),
                  CustomProperties(),
                  rtl(),
                ];
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.md$/,
        use: 'raw-loader',
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
