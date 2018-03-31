import merge from 'webpack-merge';
import webpack from 'webpack';
import common from './common';
import { join } from 'path';
import extendedNodeExternals from '../scripts/extended-node-externals';
import env from './env';

export default merge(common, {
  target: 'node',
  externals: extendedNodeExternals,
  node: {
    __dirname: false,
    __filename: false
  },
  entry: [
    join(__dirname, '../src/index')
  ],
  output: {
    filename: 'index.js',
    path: join(__dirname, '../public'),
  },
  plugins: [
    new webpack.DefinePlugin({
      ...env()
    })
  ]
});
