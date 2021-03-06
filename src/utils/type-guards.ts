import {META, NODE} from '../constants.js';
import {El} from '../types/global.types.js';
import {
  Image,
  Item,
  ItemCollapsable,
  Leaf,
  Ol,
  Stack,
  Table,
  Text,
  TextArray,
  Ul
} from '../types/item.types.js';
import {LazyItem} from '../types/lazy-item.types.js';

export const isNotText = (item: LazyItem | string): item is Item => typeof item !== 'string';
export const isColgroup = (item: LazyItem): item is Stack => item?.[META]?.[NODE]?.nodeName === 'COLGROUP';
export const isImage = (item: LazyItem): item is Image => 'image' in item;
export const isTable = (item: LazyItem): item is Table => 'table' in item;
export const isTextArray = (item?: Item): item is TextArray => !!item && typeof item !== 'string' && 'text' in item && Array.isArray(item.text);
export const isTextSimple = (item: LazyItem): item is Text => typeof item !== 'string' && 'text' in item && typeof item.text === 'string';
export const isTextOrLeaf = (item: LazyItem): item is (Leaf | Text) => 'text' in item || typeof item === 'string';
export const isList = (item: LazyItem): item is Ul | Ol => 'ul' in item || 'ol' in item;
export const isTdOrTh = (item: LazyItem) => item[META]?.[NODE]?.nodeName === 'TD' || item[META]?.[NODE]?.nodeName === 'TH' || item[META]?.[NODE]?.nodeName === 'COL';

export const isElement = (el: El): el is Element => el.nodeType === 1;
export const isNode = (el: El): el is Node => el.nodeType === 3 || el.nodeType === 8;
export const isCollapsable = (item?: Item): item is ItemCollapsable => typeof item !== 'undefined' && typeof item !== 'string' && ('stack' in item || 'ul' in item || 'ol' in item || 'table' in item) && 'margin' in item;