import pkg from './package.json';

export default {
  input: './dist/index.js',
  output: [
    {
      file: pkg.browser,
      format: 'umd',
      name: 'html2pdfmake',
    },
    {
      file: pkg['browser:esm'],
      format: 'module',
    }
  ]
};
