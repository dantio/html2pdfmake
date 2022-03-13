import {IS_COLGROUP, META, NODE} from '../constants.js';
import {El, Image, Item, ItemNode, Leaf, Ol, Table, Ul} from '../types.js';

export const isNotText = (item: Item | string): item is Item => typeof item !== 'string';
export const isColgroup = (item: Item): item is Item => typeof item !== 'string' && 'stack' in item && !!item[META]?.[IS_COLGROUP];
export const isImage = (item: Item): item is Image => 'image' in item;
export const isTable = (item: Item): item is Table => 'table' in item;
export const isTextLeaf = (item: Item): item is Leaf => 'text' in item && typeof item.text === 'string';
export const isList = (item: Item): item is Ul | Ol => 'ul' in item || 'ol' in item;
export const isTdOrTh = (item: Item) => item[META]?.[NODE] && (item[META]?.[NODE]?.nodeName === 'TD' || item[META]?.[NODE]?.nodeName === 'TH');
export const isHeadline = (item: Item) => item[META]?.[NODE] && (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(item[META]?.[NODE]?.nodeName || ''));

export const isElement = (el: El): el is Element => el.nodeType === 1;
export const isNode = (el: El): el is Node => el.nodeType === 3 || el.nodeType === 8;
export const isCollapsable = (item: Item): item is ItemNode => typeof item !== 'string' && ('stack' in item || 'ul' in item || 'ol' in item) && 'margin' in item;