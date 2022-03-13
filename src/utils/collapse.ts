import {IS_WHITESPACE, MARGIN, META, PADDING, POS_BOTTOM, POS_TOP} from '../constants.js';
import {Item} from '../types.js';
import {isCollapsable} from './type-guards.js';

export const collapseMargin = (item: Item, prevItem?: Item) => {
  if (isCollapsable(item) && item.margin && prevItem && isCollapsable(prevItem) && prevItem.margin) {
    const prevMargin = prevItem[META]?.[MARGIN] || [0, 0, 0, 0];

    prevItem[META] = {...(prevItem[META] || {}), [MARGIN]: prevMargin};
    prevItem.margin[POS_BOTTOM] = prevItem[META]?.[PADDING]?.[POS_BOTTOM] || 0;

    const itemMargin = item[META]?.[MARGIN] || [0, 0, 0, 0];
    const marginTop = Math.max(itemMargin[POS_TOP], prevMargin[POS_BOTTOM]);
    itemMargin[POS_TOP] = marginTop;
    prevMargin[POS_BOTTOM] = 0;
    item[META] = {...(item[META] || {}), [MARGIN]: itemMargin};
    item.margin[POS_TOP] = marginTop + (item[META]?.[PADDING]?.[POS_TOP] || 0);
  }
};

export const collapseWhitespace = (item: Item, next?: Item) => {
  if ('text' in item && typeof item.text === 'string' && item[META]?.[IS_WHITESPACE] && next) {
    if (next[META]?.[IS_WHITESPACE] && 'text' in next) {
      next.text = '';
    } else if (Array.isArray(next) && next[0] && next[0][IS_WHITESPACE] && 'text' in next[0]) {
      next[0].text = '';
    } else if ('text' in next
      && Array.isArray(next.text)
      && next.text[0]
      && !Array.isArray(next.text[0]) && typeof next.text[0] !== 'string' && next.text[0][META]?.[IS_WHITESPACE]) {
      next.text[0].text = '';
    }
  }
};