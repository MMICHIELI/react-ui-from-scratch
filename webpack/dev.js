const Merge = require('webpack-merge');
const Webpack = require('webpack');
const CommonConfig = require('./common');

module.exports = Merge(CommonConfig, {
  mode: 'development',
  entry: [
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    './index.tsx'
  ],
  devServer: {
    hot: true,
    port: 7770
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NamedModulesPlugin()
  ]
});