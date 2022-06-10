import {META, NODE, UID} from '../constants.js';
import {LazyItem} from '../types/lazy-item.types.js';
import {isElement} from './type-guards.js';

let _uid = 0;
export const getUniqueId = (item: LazyItem): string => {
  const meta = item[META] || {};
  const __uid = meta[UID];
  const el = item[META]?.[NODE];
  if (__uid) {
    return __uid;
  }

  if (!el) {
    return '#' + (_uid++);
  }

  if (isElement(el)) {
    const id = el.getAttribute('id');
    if (id) {
      return id;
    }
  }

  const nodeName = el.nodeName.toLowerCase();
  // TODO add parent? Or name something else?
  const uid = '#' + nodeName + '-' + (_uid++);

  meta[UID] = uid;
  item[META] = meta;

  return uid;
};