import {
  END_WITH_NEWLINE,
  END_WITH_WHITESPACE,
  HANDLER,
  IS_COLGROUP,
  IS_INPUT,
  IS_NEWLINE,
  ITEMS,
  META,
  NODE,
  POSITION,
  START_WITH_NEWLINE,
  START_WITH_WHITESPACE
} from '../constants.js';
import {Context} from '../context.js';
import {handleTable} from '../handler/index.js';
import {El, Item, Table, TableDefinition, Text} from '../types.js';
import {getChildItems} from '../utils/index.js';
import {isColgroup, isElement, isNode} from '../utils/type-guards.js';
import {toUnit} from '../utils/unit.js';
import {parseImg} from './parse-img.js';
import {parseSvg} from './parse-svg.js';
import {parseText} from './parse-text.js';
import {addWhitespace} from './whitespace.js';

const parseAsHTMLCollection = (el: El): el is Element => ['TABLE', 'COLGROUP', 'UL', 'OL', 'SELECT'].includes(el.nodeName) && 'children' in el;
export const stackRegex = /^(address|blockquote|body|center|colgroup|dir|div|dl|fieldset|form|h[1-6]|hr|isindex|menu|noframes|noscript|ol|p|pre|table|ul|dd|dt|frameset|li|tbody|td|tfoot|th|thead|tr|html)$/i;
export const isStackItem = (el: El) => stackRegex.test(el.nodeName);

export const parseChildren = (el: El, ignoreNewLines = true, ctx: Context): Item[] => {
  const items: Item[] = [];
  const children = parseAsHTMLCollection(el) ? el.children : el.childNodes;

  for (let i = 0; i < children.length; i++) {
    const subItems = parseByRule(children[i], ctx);
    if (subItems === null) {
      continue;
    }

    if (ignoreNewLines && !Array.isArray(subItems) && subItems[META]?.[START_WITH_NEWLINE]) {
      continue;
    }

    items.push(subItems);
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

export const getElementRule = (el: Element): (el: Element, ctx: Context) => Item | null => {
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
      return (el, ctx) => {
        const item = parseElement(el, ctx);
        const href = el.getAttribute('href');

        if (!href || item === null) {
          return item;
        }

        const linkify = (item: Item) => {
          const children = getChildItems(item);
          ([] as Item[]).concat(children)
            .forEach((link) => {
              if (typeof link !== 'string') {
                if (href[0] === '#') {
                  link.linkToDestination = href.slice(1);
                } else {
                  link.link = href;
                }
              }
              linkify(link);
            });
        };

        linkify(item);

        return item;
      };
    case 'br':
      return () => ({
        text: '\n',
        [META]: {
          [IS_NEWLINE]: true
        }
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
    case 'colgroup':
      return (el: Element, param) => {
        const items = parseChildren(el, true, param);
        if (items === null) {
          return null;
        }
        return {
          stack: items,
          [META]: {
            [IS_COLGROUP]: true
          }
        };
      };
    case 'col':
      return () => ({
        stack: [],
      });
    case 'ul':
    case 'ol':
      return (el: Element, param) => {
        const items = parseChildren(el, true, param);
        if (nodeName === 'ul') {
          return {
            ul: items,
          };
        }

        if (nodeName === 'ol') {
          return {
            ol: items,
          };
        }

        return null;
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

const getItemByRule = (el: El, ctx: Context): Item | null => {
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

export const parseByRule = (el: El, ctx: Context): Item | null => {
  const item = getItemByRule(el, ctx);
  if (item === null) {
    return null;
  }

  // Add ref to NODE
  const meta = item[META] || {};
  meta[NODE] = el;
  item[META] = meta;

  return item;
};

export const parseElement = (el: Element, param: Context): Item | null => {
  const childNodes = parseChildren(el, false, param);

  if (childNodes.length === 0) {
    return null;
  }

  const items: Item[] = [];

  childNodes.forEach((childNode => {
    ([] as Item[]).concat(childNode).forEach(item => {
      if (!('text' in item) || item[META]?.[POSITION]) {
        items.push(item);
        return;
      }

      // https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
      const endWithNewLine = !!item[META]?.[END_WITH_NEWLINE];
      const endWithWhiteSpace = !!item[META]?.[END_WITH_WHITESPACE];
      const isNewLine = !!item[META]?.[START_WITH_NEWLINE];
      const startWithWhitespace = !!item[META]?.[START_WITH_WHITESPACE];

      const prevItem: Item | undefined = items[items.length - 1];

      // Append text to last element
      if (prevItem && typeof prevItem !== 'string' && 'text' in prevItem && Array.isArray(prevItem.text)) {

        if (isNewLine || startWithWhitespace) {
          prevItem.text.push(addWhitespace(isNewLine ? 'isNewLine' : 'startWithWhitespace'));
          return;
        }

        prevItem.text.push(item);

        if (endWithNewLine || endWithWhiteSpace) {
          prevItem.text.push(addWhitespace('endWithNewLine'));
        }
      } else {
        if (isNewLine) {
          return;
        }

        const text = [];

        if (startWithWhitespace) {
          text.push(addWhitespace('startWithWhitespace'));
        }

        text.push(item);

        if (endWithNewLine || endWithWhiteSpace) {
          text.push(addWhitespace(endWithNewLine ? 'endWithNewLine' : 'endWithWhiteSpace'));
        }

        // TODO
        if (item.text[0] && typeof item.text[0] !== 'string' && item.text[0].absolutePosition) {
          items.push(item);
        } else {
          items.push({
            text
          });
        }
      }
    });
  }));

  if (isStackItem(el)) {
    return {
      stack: items,
    };
  }

  if (items.length > 1) {
    return {
      text: items as Text[]
    };
  }

  return items[0];
};

export const parseTable = (el: Element, ctx: Context): Table | null => {
  const items = parseChildren(el, true, ctx);

  if (items.length === 0) {
    return null;
  }

  // tbody -> tr
  const colgroup = items.find(isColgroup) || [];
  const tbody = items.filter(item => !isColgroup(item));
  const trs = tbody.flatMap((item) => 'stack' in item ? item.stack : []);
  const body = trs.map((item) => getChildItems(item));

  if (body.length === 0) {
    return null;
  }

  const longestRow = body.reduce((a, b) => a.length <= b.length ? b : a);

  const table: TableDefinition = {
    body,
    widths: new Array(longestRow.length).fill('auto'),
    heights: new Array(trs.length).fill('auto')
  };

  // TODO table in table?
  return {
    table: {
      body: [[{
        table,
        layout: {
          defaultBorder: false
        },
      }]],
      // widths: ['*'],
    },
    [META]: {
      [ITEMS]: {colgroup, trs},
      [HANDLER]: handleTable,
    },
    layout: {}
  };
};

