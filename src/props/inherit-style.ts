import {META, NODE, STYLE} from '../constants.js';
import {El, Styles} from '../types/global.types.js';
import {LazyItem} from '../types/lazy-item.types.js';

export const inheritStyle = (el: El, parentItem?: LazyItem): Styles => {
  if (!parentItem) {
    return {};
  }

  const styles = parentItem[META]?.[STYLE] || {};

  // TR does not really exist
  const isTr = parentItem?.[META]?.[NODE]?.nodeName === 'TR';

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

    background: isTr,
    'background-color': isTr,
    'font-style': true,
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