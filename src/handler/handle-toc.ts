import {META, NODE} from '../constants.js';
import {Item, Leaf, Text} from '../types.js';
import {merge} from '../utils/merge.js';

export const addTocItem = (item: Item, tocStyle = {}) => {
  if ('text' in item && typeof item.text === 'string') {
    item.tocItem = true;
    merge(item, tocStyle);
  } else if ('stack' in item) {
    const text = item.stack.find(s => 'text' in s) as Text | Leaf | undefined;
    if (text && typeof text !== 'string') {
      text.tocItem = true;
      merge(text, tocStyle);
    }
  }
};

export const handleHeadlineToc = (item: Item) => {
  const tocStyle = {};

  if (item[META]?.[NODE]?.nodeName === 'H1') {
    Object.assign(tocStyle, {
      tocNumberStyle: {bold: true}
    });
  } else {
    Object.assign(tocStyle, {
      tocMargin: [10, 0, 0, 0]
    });
  }

  addTocItem(item, tocStyle);

  return item;
};