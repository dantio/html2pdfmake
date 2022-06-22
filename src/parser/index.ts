import {
  END_WITH_NEWLINE,
  END_WITH_WHITESPACE,
  IS_INPUT,
  IS_NEWLINE,
  IS_WHITESPACE,
  META,
  NODE,
  START_WITH_NEWLINE,
  START_WITH_WHITESPACE,
  STYLE
} from '../constants.js';
import {Context} from '../context.js';
import {handleItem} from '../handler/index.js';
import {computeProps} from '../props/index.js';
import {El} from '../types/global.types.js';
import {Item, TextArray} from '../types/item.types.js';
import {LazyItem} from '../types/lazy-item.types.js';
import {collapseMargin, collapseWhitespace} from '../utils/collapse.js';
import {isElement, isNode, isTextArray, isTextOrLeaf} from '../utils/type-guards.js';
import {toUnit} from '../utils/unit.js';
import {addWhitespace} from '../utils/whitespace.js';
import {parseImg} from './parse-img.js';
import {parseLink} from './parse-link.js';
import {parseSvg} from './parse-svg.js';
import {parseTable} from './parse-table.js';
import {parseText} from './parse-text.js';

const parseAsHTMLCollection = (el: El): el is Element => ['TABLE', 'TBODY', 'TR', 'COLGROUP', 'COL', 'UL', 'OL', 'SELECT'].includes(el.nodeName) && 'children' in el;
export const stackRegex = /^(address|blockquote|body|center|colgroup|dir|div|dl|fieldset|form|h[1-6]|hr|isindex|menu|noframes|noscript|ol|p|pre|table|ul|dd|dt|frameset|li|tbody|td|tfoot|th|thead|tr|html)$/i;
export const isStackItem = (el: El) => stackRegex.test(el.nodeName);

export const parseChildren = (el: El, ctx: Context, parentItem?: LazyItem): Item[] => {
  const items: Item[] = [];
  const children = parseAsHTMLCollection(el) ? el.children : el.childNodes;

  for (let i = 0; i < children.length; i++) {
    const item = parseByRule(children[i], ctx, parentItem);
    if (item === null) {
      continue;
    }

    const isNewline = !!item[META]?.[IS_NEWLINE];
    const prevItem: Item | undefined = items[items.length - 1];

    if (ctx.config.collapseMargin && prevItem) {
      collapseMargin(item, prevItem);
    }

    const prevIsBlock = prevItem && !('text' in prevItem);

    // Skip new lines
    if (isNewline && (items.length === 0 || !children[i + 1] || prevIsBlock)) {
      continue;
    }

    // Block item
    if (!('text' in item)) {
      items.push(item);
      continue;
    }

    const endWithNewLine = !!item[META]?.[END_WITH_NEWLINE];
    const startWithNewLine = !!item[META]?.[START_WITH_NEWLINE];
    const endWithWhiteSpace = !!item[META]?.[END_WITH_WHITESPACE];
    const startWithWhitespace = !!item[META]?.[START_WITH_WHITESPACE];
    const isWhitespace = !!item[META]?.[IS_WHITESPACE];
    const isAbsolutePosition = item?.[META]?.[STYLE]?.position === 'absolute';

    const textItem: TextArray = Array.isArray(item.text)
      ? item as TextArray
      : {text: [isNewline || isWhitespace ? addWhitespace('newLine') : item]};

    if (!isNewline && !isWhitespace) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
      // add whitespace before
      if (startWithNewLine || startWithWhitespace) {
        textItem.text.unshift(addWhitespace(startWithNewLine ? 'startWithNewLine' : 'startWithWhitespace'));
      }

      // add whitespace after
      if (endWithNewLine || endWithWhiteSpace) {
        textItem.text.push(addWhitespace(endWithNewLine ? 'endWithNewLine' : 'endWithWhiteSpace'));
      }
    }

    // Append text to last text element otherwise a new line is created
    if (isTextArray(prevItem)) {

      if (ctx.config.collapseWhitespace) {
        collapseWhitespace(prevItem, textItem);
      }

      prevItem.text.push(textItem);
    } else if (isAbsolutePosition) {
      items.push(textItem);
    } else {
      // wrap so the next text items  will be appended to it
      items.push({
        text: [textItem]
      });
    }
  }

  return items;
};

export const getNodeRule = (node: Node): (el: Node, ctx: Context) => Item | null => {
  const nodeName = node.nodeName.toLowerCase();

  switch (nodeName) {
    case '#comment':
      return () => null;
    case '#text':
      return parseText;

    default:
      return () => null;
  }
};

export const getElementRule = (el: Element): (el: Element, ctx: Context) => LazyItem | null => {
  const nodeName = el.nodeName.toLowerCase();
  switch (nodeName) {
    case '#comment':
    case 'option': // see <select>
    case 'script':
    case 'style':
    case 'iframe':
    case 'object':
      return () => null;
    case '#text':
      return parseText;
    case 'a':
      return (el) => {
        const href = el.getAttribute('href');

        if (!href) {
          return parseElement(el);
        }

        return parseLink(href);
      };
    case 'br':
      return () => ({
        text: '\n'
      });
    case 'qr-code': // CUSTOM
      return (el) => {
        const content = el.getAttribute('value');
        if (!content) {
          return null;
        }

        const sizeAttr = el.getAttribute('data-size');
        const size = sizeAttr ? toUnit(sizeAttr) : toUnit('128px');
        return {
          qr: content,
          fit: size,
        };
      };
    case 'toc': // CUSTOM
      return (el) => {
        const content = el.textContent;
        if (!content) {
          return null;
        }
        return {
          toc: {
            title: {
              text: content,
              bold: true,
              fontSize: toUnit('22px'),
              margin: [0, 10, 0, 10]
            },
          },
        };
      };
    case 'table':
      return parseTable;
    case 'ul':
      return () => {
        return {
          ul: (items) => items
        };
      };
    case 'ol':
      return () => {
        return {
          ol: (items) => items
        };
      };
    case 'img':
      return parseImg;
    case 'svg':
      return parseSvg;
    case 'hr':
      // TODO find better <hr> alternative?
      return () => {
        return {
          table: {
            widths: ['*'],
            body: [
              [''],
            ]
          },
          style: ['hr'],
        };
      };
    case 'input':
      // TODO acro-form
      return (el) => {
        if (el instanceof HTMLInputElement) {
          return {
            text: 'value' in el ? el.value : '',
            [META]: {
              [IS_INPUT]: true
            }
          };
        }

        return null;
      };
    case 'select':
      // TODO acro-form
      return (el) => {
        if (el instanceof HTMLSelectElement) {
          const value = el.options[el.selectedIndex].value;
          return {
            text: value,
            [META]: {
              [IS_INPUT]: true
            }
          };
        }
        return null;
      };
    default:
      return parseElement;
  }
};

const getItemByRule = (el: El, ctx: Context): LazyItem | null => {
  if (typeof ctx.config.customRule === 'function') {
    const result = ctx.config.customRule(el, ctx);
    if (result === null) {
      return null;
    } else if (result !== undefined) {
      return result;
    }
  }

  if (isElement(el)) { // ELEMENT_NODE
    return getElementRule(el)(el, ctx);
  } else if (isNode(el)) { // TEXT_NODE || COMMENT_NODE
    return getNodeRule(el)(el, ctx);
  }

  throw new Error('Unsupported Node Type: ' + (el as El).nodeType);
};

const parseLazyChildren = (item: LazyItem, el: El, ctx: Context) => {
  if ('stack' in item && typeof item.stack === 'function') {
    const children = parseChildren(el, ctx, item);
    item.stack = item.stack(children, ctx, item);
  } else if ('text' in item && typeof item.text === 'function') {
    const children = parseChildren(el, ctx, item);
    item.text = item.text(children.filter(isTextOrLeaf), ctx, item);
  } else if ('ul' in item && typeof item.ul === 'function') {
    const children = parseChildren(el, ctx, item);
    item.ul = item.ul(children, ctx, item);
  } else if ('ol' in item && typeof item.ol === 'function') {
    const children = parseChildren(el, ctx, item);
    item.ol = item.ol(children, ctx, item);
  } else if ('table' in item && typeof item.table.body === 'function') {
    const children = parseChildren(el, ctx, item);
    item.table.body = item.table.body(children, ctx, item);
  }
};

export const processItems = (item: LazyItem, ctx: Context, parentItem?: LazyItem): Item | null => {
  const el = item[META]?.[NODE];

  if (typeof item !== 'string' && el) {
    const props = computeProps(el, item, ctx, parentItem);

    Object.assign(item, props);

    parseLazyChildren(item, el, ctx);
  }

  return handleItem(item as Item);
};

export const parseByRule = (el: El, ctx: Context, parentItem?: LazyItem): Item | null => {
  const item = getItemByRule(el, ctx);
  if (item === null) {
    return null;
  }

  // Add ref to NODE
  const meta = item[META] || {};
  meta[NODE] = el;
  item[META] = meta;

  return processItems(item, ctx, parentItem);
};

export const parseElement = (el: Element): LazyItem | null => {
  if (isStackItem(el)) {
    return {
      stack: (items) => items
    };
  }

  return {
    text: (items) => {
      // Return flat
      if (items.length === 1 && 'text' in items[0] && Array.isArray(items[0].text)) {
        return items[0].text;
      }
      return items;
    }
  };
};

