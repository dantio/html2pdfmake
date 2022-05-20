import {HANDLER, META, PDFMAKE} from '../constants.js';
import {Item} from '../types.js';
import {merge} from '../utils/merge.js';

export * from './handle-columns.js';
export * from './handle-img.js';
export * from './handle-table.js';
export * from './handle-toc.js';

export const handleItem = (item: Item): Item | null => {
  if (typeof item !== 'string' && item[META]?.[PDFMAKE]) {
    merge(item, item[META]?.[PDFMAKE] || {});
  }

  if (typeof item[META]?.[HANDLER] === 'function') {
    return item[META]?.[HANDLER]?.(item) || null;
  }

  return item;
};