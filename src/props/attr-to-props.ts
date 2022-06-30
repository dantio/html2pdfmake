import {CLASSES, META, NODE, PDFMAKE, POST_HANDLER, STYLE} from '../constants.js';
import {addTocItem} from '../handler/index.js';
import {Item} from '../types/item.types.js';
import {LazyItem, LazyItemNode} from '../types/lazy-item.types.js';
import {MetaNode} from '../types/meta.types.js';
import {ComputedProps} from '../types/props.types.js';
import {getUniqueId} from '../utils/unique-id.js';
import {toUnit} from '../utils/unit.js';

// TODO make customizable
const computeStyleClasses = (item: LazyItemNode, cascadeClass: string[] = []) => {
  const el = item[META]?.[NODE];
  if (!el || !('getAttribute' in el)) {
    return [];
  }

  const cssClass = el.getAttribute('class') || '';
  const cssClasses = [...new Set( // TODO use classList?
    cssClass.split(' ')
      .filter((value: string) => value)
      .map((value: string) => '.' + value.trim())
  )];

  const nodeName = el.nodeName.toLowerCase();
  const parentNodeName = el.parentNode ? el.parentNode.nodeName.toLowerCase() : null;

  const styleNames = [
    nodeName,
  ]
    .concat(cascadeClass.map(cssClass => cssClass + ' ' + nodeName))
    .concat(cssClasses)
    .concat(cssClasses.map(cssClass => nodeName + cssClass));

  if (cssClasses.length > 2) {
    styleNames.push(cssClasses.join('')); // .a.b.c
  }

  if (parentNodeName) {
    styleNames.push(parentNodeName + '>' + nodeName);
  }

  const uniqueId = getUniqueId(item);
  styleNames.push(uniqueId); // Should be the last one

  // TODO improve sort by specificity
  return [...new Set((item.style || [] as string[]).concat(styleNames))];
};

export const attrToProps = (item: LazyItemNode, parentItem?: LazyItem): ComputedProps => {
  const el = item[META]?.[NODE];
  if (!el || !('getAttribute' in el)) return {[META]: {[STYLE]: {}}};

  const cssClasses = computeStyleClasses(item, parentItem?.[META]?.[CLASSES]);

  const nodeName = el.nodeName.toLowerCase();

  const props: ComputedProps = {
    [META]: {
      [STYLE]: item[META]?.[STYLE] || {},
      [CLASSES]: (parentItem?.[META]?.[CLASSES] || []).concat(cssClasses),
      ...(item[META] || {})
    },
    style: cssClasses
  };

  for (let i = 0; i < el.attributes.length; i++) {
    const name = el.attributes[i].name;
    const value = el.getAttribute(name)?.trim() || null;
    if (value == null) {
      continue;
    }
    props[META][STYLE][name] = value;
    switch (name) {
      case 'rowspan':
        props.rowSpan = parseInt(value, 10);
        break;
      case 'colspan':
        props.colSpan = parseInt(value, 10);
        break;

      case 'value':
        if (nodeName === 'li') {
          props.counter = parseInt(value, 10);
        }
        break;
      case 'start': // ol
        if (nodeName === 'ol') {
          props.start = parseInt(value, 10);
        }
        break;
      case 'width':
        if ('image' in item) {
          props.width = toUnit(value);
        }
        break;
      case 'height':
        if ('image' in item) {
          props.height = toUnit(value);
        }
        break;
      case 'data-fit':
        if (value === 'true') {
          const width = el.getAttribute('width');
          const height = el.getAttribute('height');

          if (width && height) {
            props.fit = [toUnit(width), toUnit(height)];
          }
        }
        break;

      case 'data-toc-item':
        if (value !== 'false') {
          let toc = {};
          if (value) {
            try {
              toc = JSON.parse(value);
            } catch (e) {
              console.warn('Not valid JSON format.', value);
            }
          }
          props[META][POST_HANDLER] = (item: MetaNode<Item>) => {
            addTocItem(item, toc);

            return item;
          };
        }
        break;

      case 'data-pdfmake':
        if (value) {
          try {
            props[META][PDFMAKE] = JSON.parse(value);
          } catch (e) {
            console.warn('Not valid JSON format.', value);
          }
        }
        break;
      default:
    }
  }

  return props;
};