import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import multiEntry from '@rollup/plugin-multi-entry';

export default {
  plugins: [
    json(),
    babel(),
    resolve({ preferBuiltins: true }),
    commonjs(),
    multiEntry()
  ],
  output: {

    format: 'umd',
    name: 'practice-3',
    sourcemap: true
  }
};
