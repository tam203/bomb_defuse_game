const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/javascript/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.html/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
    new CopyWebpackPlugin([{from : 'src/static'}])
  ]
};
