import config from './rollup.config.js';
import deepmerge from 'deepmerge';

export default deepmerge({
  input: 'src/index.js',
  output: {
    file: 'build/bundle.js'
  }
}, config);
