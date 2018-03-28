import { join } from 'path';

export default {
  entry: [
    'babel-polyfill',
  ],
  output: {
    path: join(__dirname, '../public/assets'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      join(__dirname, '../node_modules'),
      join(__dirname, '../src')
    ]
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader'
    },
    {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    }]
  }
};
