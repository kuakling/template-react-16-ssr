import merge from 'webpack-merge';
import webpack from 'webpack';
import common from './common';
import { join } from 'path';
import nodeExternals from '../scripts/node-externals';
import env from './env';

export default merge(common, {
  name: 'server',
  target: 'node',
  externals: nodeExternals,
  entry: [
    join(__dirname, '../src/server/index')
  ],
  devtool: 'inline-source-map',
  output: {
    filename: 'app.server.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(styl|css)/,
        exclude: [/style.global/, /node_modules/],
        use: [
          {
            loader: 'css-loader/locals',
            options: {
              modules: true,
              localIdentName: '[local]--[hash:base64:5]'
            }
          },
          {
            loader: 'stylus-loader'
          }
        ]
      },
      {
        test: /\global\.styl/,
        use: [
          {
            loader: 'css-loader/locals',
            options: {
              localIdentName: '[local]'
            }
          },
          {
            loader: 'stylus-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      SERVER: true,
      ...env()
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
});
