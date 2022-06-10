import {El, Styles} from '../types/global.types.js';

export const inheritStyle = (styles: Styles, el: El): Styles => {
  // TODO what do we want to exclude ?
  const pick: Record<string, boolean> = {
    color: el.nodeName !== 'A',
    'font-family': true,
    'font-size': true,
    'font-weight': true,
    'font': true,
    'line-height': true,
    'list-style-type': true,
    'list-style': true,
    'text-align': true,

    // TODO only if parent is text: []
    background: true,
    'font-style': true,
    'background-color': true,
    'font-feature-settings': true,
    'white-space': true,
    'vertical-align': true,
    'opacity': true,
    'text-decoration': true,
  };

  return Object.keys(styles).reduce((p, c) => {
    if (pick[c] || styles[c] === 'inherit') {
      p[c] = styles[c];
    }

    return p;
  }, {} as Styles);
};