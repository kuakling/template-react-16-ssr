import merge from 'webpack-merge';
import webpack from 'webpack';
import common from './common';
import { join } from 'path';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import env from './env';

const baseUrl = process.env.REACT_APP_BASE_URL ? `${process.env.REACT_APP_BASE_URL}/` : '';

export default merge(common, {
  name: 'client',
  target: 'web',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false',
    join(__dirname, '../src/client/index')
  ],
  devtool: 'inline-source-map',
  output: {
    filename: `${baseUrl}app.client.js`,
    chunkFilename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.(styl|css)$/,
      exclude: [/style.global/, /node_modules/],
      use: ExtractCssChunks.extract({
        use: [{
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[name]__[local]--[hash:base64:5]'
          }
        }, {
          loader: 'stylus-loader'
        }]
      })
    },
    {
      test: /\global\.styl$/,
      use: ExtractCssChunks.extract({
        use: [{
          loader: 'css-loader',
          options: {
            localIdentName: '[local]'
          }
        }, {
          loader: 'stylus-loader'
        }]
      })
    }]
  },
  plugins: [
    new ExtractCssChunks({
      filename: `${baseUrl}[name].css`
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: `${baseUrl}initial.js`,
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      SERVER: false,
      ...env()
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
