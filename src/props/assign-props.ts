import {HANDLER, ITEMS, META, NODE, PDFMAKE} from '../constants.js';
import {Context} from '../context.js';
import {computeProps} from './index.js';
import {Item} from '../types.js';
import {getChildItems} from '../utils/index.js';
import {collapseMargin, collapseWhitespace} from '../utils/collapse.js';
import {merge} from '../utils/merge.js';

export const assignProps = (items: Item[], ctx: Context) => {
  const assignItemProperty = (item: Item, parentStyles = {}) => {
    const node = item[META]?.[NODE];
    let styles = {};

    if (typeof item !== 'string' && node) {
      const {cssStyles, props} = computeProps(node, item, ctx.styles, parentStyles);

      Object.assign(item, props);
      styles = cssStyles;
    }

    // assign props also for meta items
    const metaItems = Object.values(item[META]?.[ITEMS] || {}).flatMap(i => i);
    const childItems = getChildItems(item).concat(metaItems);

    assignItemsProperties(childItems, styles);

    handleItem(item);
  };

  const assignItemsProperties = (items: Item[] | Item, parentStyle = {}) => {
    if (Array.isArray(items)) {
      items.forEach((item, i) => {
        assignItemsProperties(item, parentStyle);

        if (typeof item !== 'string') {
          const prev = items[i - 1];
          const next = items[i + 1];
          if (ctx.config.collapseMargin && prev) {
            collapseMargin(item, prev);
          }

          if (ctx.config.collapseWhitespace && next) {
            collapseWhitespace(item, next);
          }
        }
      });
    } else {
      assignItemProperty(items, parentStyle);
    }
  };

  assignItemsProperties(items);
};

export const handleItem = (item: Item) => {
  // Handle columns
  if (typeof item[META]?.[HANDLER] === 'function') {
    item[META]?.[HANDLER]?.(item);
  }

  if (typeof item !== 'string' && item[META]?.[PDFMAKE]) {
    merge(item, item[META]?.[PDFMAKE] || {});
  }
};