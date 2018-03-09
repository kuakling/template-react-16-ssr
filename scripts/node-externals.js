import { readdirSync } from 'fs';
import { join } from 'path';
// require('dotenv').config()

export default readdirSync(join(__dirname, '../node_modules'))
  .filter(x => !/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks/.test(x))
  .reduce((externals, mod) => {
    externals[mod] = `commonjs ${mod}`;
    return externals;
  },
{});
