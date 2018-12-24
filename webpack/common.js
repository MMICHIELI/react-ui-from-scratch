const { resolve } = require('path');
const HappyPack = require('happypack');
const HtmlPlugin = require('html-webpack-plugin');
const ForkTsPlugin = require('fork-ts-checker-webpack-plugin');
const PwaManifest = require('webpack-pwa-manifest');

/**
 * HappyPack - Configurations
 */
const BabelPack = new HappyPack({
  id: 'javascript',
  threads: 2,
  verbose: true,
  loaders: [ {
    path: 'babel-loader',
    query: {
      preset: [ 'env', 'react', 'stage-0' ],
      plugins: [ 'transform-object-rest-spread' ]
    }
  } ]
});
const TsPack = new HappyPack({
  id: 'typescript',
  threads: 2,
  verbose: true,
  loaders: [ {
    path: 'ts-loader',
    query: {
      happyPackMode: true,
      configFile: resolve(__dirname, '../tsconfig.json')
    }
  } ]
});

/**
 * ForkTSChecker
 */
const ForkTSChecker = new ForkTsPlugin({
  async: false,
  checkSyntacticErrors: true,
  tsconfig: resolve(__dirname, '../tsconfig.json'),
  tslint: resolve(__dirname, '../tslint.json')
});

/**
 * Html Webpack => Entry Point (html)
 */
const HtmlWebpack = new HtmlPlugin({
  title: 'React UI From Scratch',
  template: 'index.html',
  filename: 'index.html',
  favicon: './favicon.ico'
});

/**
 * WebpackPwa
 */
const WebpackPwa = new PwaManifest({
  name: 'React UI From Scratch',
  short_name: 'RUFS',
  description: 'React UI in Typescript using Webpack 4 & Babel',
  theme_color: '#000000',
  background_color: '#FFFFFF',
  icons: [
    {
      'src': resolve('src/favicon.ico'),
      'size': '16*16'
    }
  ],
  display: 'standalone',
  start_url: '.',
  fingerprints: false
});

module.exports = {
  resolve: {
    extensions: [ '*', '.ts', '.tsx', '.js', '.jsx', '.json' ]
  },
  context: resolve(__dirname, '../src'),
  module: {
    rules: [
      { // All '.js' | '.jsx' extension
        test: /\.(js|jsx)$/,
        include: /src/,
        exclude: /node_modules/,
        use: [ {
          loader: 'cache-loader'
        }, {
          loader: 'happypack/loader?id=javascript'
        } ]
      },
      { // All '.ts' | '.tsx' extension
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [ {
          loader: 'cache-loader'
        }, {
          loader: 'happypack/loader?id=typescript'
        } ]
      },
      { //  Re-process all sourcemaps in '.js' files with 'babel-loader & 'eslint-loader7
        enforce: 'pre', test: /\.js$/,
        use: [ {
          loader: 'babel-loader'
        }, {
          loader: 'eslint-loader'
        } ]
      },
      { // Fonts
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader?name=assets/fonts/[name].[ext]'
      },
      { // Images
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'file-loader?name=assets/images/[name].[ext]'
      }
    ]
  },
  optimization: {
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10
        }
      }
    },
    runtimeChunk: true
  },
  plugins: [
    BabelPack,
    TsPack,
    ForkTSChecker,
    HtmlWebpack,
    WebpackPwa
  ],
  performance: {
    hints: false
  }
};