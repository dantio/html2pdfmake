import {POST_HANDLER, META, PDFMAKE, PRE_HANDLER} from '../constants.js';
import {Item} from '../types/item.types.js';
import {LazyItem} from '../types/lazy-item.types.js';
import {MetaNode} from '../types/meta.types.js';
import {merge} from '../utils/merge.js';

export * from './handle-columns.js';
export * from './handle-img.js';
export * from './handle-table.js';
export * from './handle-toc.js';

/**
 * Executed before children are parsed.
 * @param item
 */
export const preHandleLazyItem = (item: MetaNode<LazyItem>): MetaNode<LazyItem> | null => {
  if (typeof item !== 'string' && item[META][PDFMAKE]) {
    merge(item, item[META][PDFMAKE] || {});
  }

  if (typeof item[META][PRE_HANDLER] === 'function') {
    return item[META][PRE_HANDLER]?.(item) || null;
  }

  return item;
};

/**
 * Executed after children are parsed.
 * @param item
 */
export const postHandleItem = (item: MetaNode<Item>): MetaNode<Item> | null => {
  if (typeof item[META][POST_HANDLER] === 'function') {
    return item[META][POST_HANDLER]?.(item) || null;
  }

  return item;
};

