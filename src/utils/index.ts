import {Item} from '../types/item.types.js';
import {isNotText} from './type-guards.js';

export const getChildItems = (item: Item): Item[] => {
  if (typeof item === 'string') {
    return [];
  }

  if ('stack' in item) {
    return item.stack;
  }

  if ('text' in item && typeof item.text !== 'string') {
    return item.text;
  }

  if ('table' in item) {
    return item.table.body
      .flatMap(tr => tr)
      .filter(isNotText);
  }

  if ('ul' in item) {
    return item.ul;
  }

  if ('ol' in item) {
    return item.ol;
  }

  return [];
};

