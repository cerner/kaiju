const Autoprefixer = require('autoprefixer');
const CustomProperties = require('postcss-custom-properties');

const I18nAggregatorPlugin = require('terra-i18n-plugin');
const i18nSupportedLocales = require('terra-i18n/lib/i18nSupportedLocales');

const config = (rootPath, entryPath, inputFs) => (
  {
    entry: {
      preview: entryPath,
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['/aggregated-translations', `${rootPath}/node_modules`],
    },
    plugins: [
      new I18nAggregatorPlugin({
        baseDirectory: '/',
        supportedLocales: i18nSupportedLocales,
        outputFileSystem: inputFs,
        inputFileSystem: inputFs,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [require.resolve('babel-preset-es2015'), require.resolve('babel-preset-react')],
              plugins: [require.resolve('babel-plugin-transform-object-rest-spread')],
            },
          },
        },
        {
          test: /\.(scss|css)$/,
          use: [
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
          ],
        },
      ],
    },
  }
);

export default config;
