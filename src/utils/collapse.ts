import {IS_WHITESPACE, MARGIN, META, PADDING, POS_BOTTOM, POS_TOP} from '../constants.js';
import {Item, Leaf, Text, TextArray} from '../types.js';
import {isCollapsable, isTextArray} from './type-guards.js';

export const collapseMargin = (item: Item, prevItem?: Item) => {
  if (isCollapsable(item) && isCollapsable(prevItem)) {
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

const findLastDeep = (ta: TextArray): Text | Leaf | undefined => {
  const last = ta.text.at(-1);
  if (isTextArray(last)) {
    return findLastDeep(last);
  }

  return last;
};

const findFirstArrayDeep = (ta: TextArray): Array<Text | Leaf> | undefined => {
  const first = ta.text.at(0);
  if (isTextArray(first)) {
    return findFirstArrayDeep(first);
  }

  return ta.text;
};

export const collapseWhitespace = (item: TextArray, nextText: TextArray) => {
  const prevLastText = findLastDeep(item);
  const nextFirstTextArray = findFirstArrayDeep(nextText);

  if (prevLastText && prevLastText[META]?.[IS_WHITESPACE] && nextFirstTextArray?.[0][META]?.[IS_WHITESPACE]) {
    nextFirstTextArray.shift();
  }
};