import nodeExternals from './node-externals';
const projectExternals = {
  './assets/stats.json': 'commonjs ./assets/stats.json',
  './assets/app.server.js': 'commonjs ./assets/app.server.js'
};

export default {
    ...nodeExternals,
    ...projectExternals
};
