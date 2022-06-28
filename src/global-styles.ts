import {CssStyles} from './types/global.types.js';

export const globalStyles = (): CssStyles => ({
  ':root': {
    'font-size': '16px',
    'line-height': 1.2
  },
  h1: {
    'font-size': '2em',
    'margin-top': '21.44px',
    'margin-bottom': '21.44px',
    'font-weight': 'bold'
  },
  h2: {
    'font-size': '1.5em',
    'margin-top': '19.92px',
    'margin-bottom': '19.92px',
    'font-weight': 'bold'
  },
  h3: {
    'font-size': '1.17em',
    'margin-top': '18.72px',
    'margin-bottom': '18.72px',
    'font-weight': 'bold'
  },
  h4: {
    'margin-top': '21.28px',
    'margin-bottom': '21.28px',
    'font-weight': 'bold'
  },
  h5: {
    'font-size': '.83em',
    'margin-top': '22.17px',
    'margin-bottom': '22.17px',
    'font-weight': 'bold'
  },
  h6: {
    'font-size': '.67em',
    'margin-top': '24.97px',
    'margin-bottom': '24.97px',
    'font-weight': 'bold'
  },
  b: {
    'font-weight': 'bold'
  },
  strong: {
    'font-weight': 'bold'
  },
  i: {
    'font-style': 'italic',
  },
  em: {
    'font-style': 'italic'
  },
  s: {
    'text-decoration': 'line-through'
  },
  del: {
    'text-decoration': 'line-through'
  },
  sub: {
    'font-size': '22px',
    'vertical-align': 'sub'
  },
  sup: {
    'font-size': '13px',
    'vertical-align': 'super'
  },
  small: {
    'font-size': '13px'
  },
  u: {
    'text-decoration': 'underline'
  },

  ul: {
    'margin-top': '16px',
    'margin-bottom': '16px',
    'padding-left': '20px'
  },
  ol: {
    'margin-top': '16px',
    'margin-bottom': '16px',
    'padding-left': '20px'
  },
  p: {
    'margin-top': '16px',
    'margin-bottom': '16px'
  },
  figure: {
    padding: '16px 40px'
  },
  tr: {
    /*  margin: '4px 0'*/
  },
  th: {
    'font-weight': 'bold',
    'text-align': 'center'
  },
  a: {
    color: '#0000ee',
    'text-decoration': 'underline'
  },
  hr: {
    'border': '1px solid #9a9a9a',
    'border-bottom': '0',
    'border-left': '0',
    'border-right': '0',
    margin: '8px 0'
  },
  pre: {
    'white-space': 'pre'
  }
});