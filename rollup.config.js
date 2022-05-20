import pkg from './package.json';
import {terser} from 'rollup-plugin-terser';

export default {
  input: './dist/index.js',
  output: [
    {
      file: pkg.browser,
      format: 'umd',
      name: 'html2pdfmake',
      sourcemap: true,
      compact: true,
      plugins: [terser()]
    },
    {
      file: pkg['browser:esm'],
      format: 'module',
      sourcemap: false
    }
  ]
};
