const { resolve } = require('path');
const Merge = require('webpack-merge');
const Webpack = require('webpack');
const CleanWebpack = require('clean-webpack-plugin');
const Uglifyjs = require('uglifyjs-webpack-plugin');
const CommonConfig = require('./common');

module.exports = Merge(CommonConfig, {
  mode: 'production',
  entry: './index.tsx',
  output: {
    filename: '[name].[chunkhash].js',
    path: resolve(__dirname, '../dist'),
    publicPath: `/${process.env.PROJECT}/`
  },
  devtool: 'source-map',
  plugins: [

    new CleanWebpack([ 'dist' ],
      function ()
      {
        this.plugin('done', function (stats)
        {
          if (stats && stats.hasErrors()) {
            stats.toJSON().errors.forEach((err) =>
            {
              console.error(err);
            });
            process.exit(1);
          }
        })
      }
    ),

    new Uglifyjs({
      parallel: true,
      sourceMap: false
    })
  ]
});