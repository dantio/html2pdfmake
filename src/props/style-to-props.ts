import {HANDLER, META, NODE, POS_BOTTOM, POS_LEFT, POS_RIGHT, POS_TOP, POSITION, STYLE} from '../constants.js';
import {handleColumns, handleHeadlineToc, handleImg} from '../handler/index.js';
import {ComputedProps, LazyItemNode, Styles, Table} from '../types.js';
import {isHeadline, isImage, isList, isTable, isTdOrTh, isTextSimple} from '../utils/type-guards.js';
import {expandValueToUnits, toUnit, toUnitOrValue} from '../utils/unit.js';
import {computeBorder} from './border.js';
import {computeMargin} from './margin.js';
import {computePadding} from './padding.js';

export const styleToProps = (item: LazyItemNode, styles: Styles, rootStyles: Styles = {}) => {
  const props: ComputedProps = {
    [META]: {
      [STYLE]: {},
      ...(item[META] || {}),
    }
  };

  const meta = props[META];
  const image = isImage(item);
  const table = isTable(item);
  const text = isTextSimple(item);
  const list = isList(item);
  const rootFontSize = toUnit(rootStyles['font-size'] || '16px');

  if (isHeadline(item)) {
    meta[HANDLER] = handleHeadlineToc;
  }

  Object.keys(styles).forEach((key: string) => {
    const directive = key;
    const value = ('' + styles[key]).trim();

    props[META][STYLE][directive] = value;

    switch (directive) {
      case 'padding': {
        const paddings = expandValueToUnits(value);
        if (table && paddings !== null) {
          let layout = props.layout || item.layout || {};
          if (typeof layout === 'string') {
            layout = {};
          }
          layout.paddingLeft = () => Number(paddings[POS_LEFT]);
          layout.paddingRight = () => Number(paddings[POS_RIGHT]);
          layout.paddingTop = (i: number) => (i === 0) ? Number(paddings[POS_TOP]) : 0;
          layout.paddingBottom = (i: number, node: Table) => (i === node.table.body.length - 1) ? Number(paddings[POS_BOTTOM]) : 0;
          props.layout = layout;
        } else if (paddings !== null) {
          computePadding(props, item, Number(paddings[POS_TOP]), POS_TOP);
          computePadding(props, item, Number(paddings[POS_LEFT]), POS_LEFT);
          computePadding(props, item, Number(paddings[POS_RIGHT]), POS_RIGHT);
          computePadding(props, item, Number(paddings[POS_BOTTOM]), POS_BOTTOM);
        }
        break;
      }
      case 'border':
      case 'border-bottom':
      case 'border-top':
      case 'border-right':
      case 'border-left':
        computeBorder(item, props, directive, value);
        break;
      case 'font-size': {
        props.fontSize = toUnit(value, rootFontSize);
        break;
      }
      case 'line-height':
        props.lineHeight = toUnit(value, rootFontSize);
        break;
      case 'letter-spacing':
        props.characterSpacing = toUnit(value);
        break;
      case 'text-align':
        props.alignment = value;
        break;
      case 'font-feature-settings': {
        const settings = value.split(',').filter(s => s).map(s => s.replace(/['"]/g, ''));
        const fontFeatures = item.fontFeatures || props.fontFeatures || [];
        fontFeatures.push(...settings);
        props.fontFeatures = fontFeatures;
        break;
      }
      case 'font-weight':
        switch (value) {
          case 'bold':
            props.bold = true;
            break;
          case 'normal':
            props.bold = false;
            break;
        }
        break;
      case 'text-decoration':
        switch (value) {
          case 'underline':
            props.decoration = 'underline';
            break;
          case 'line-through':
            props.decoration = 'lineThrough';
            break;
          case 'overline':
            props.decoration = 'overline';
            break;
        }
        break;
      case 'text-decoration-color':
        props.decorationColor = value;
        break;
      case 'text-decoration-style':
        props.decorationStyle = value;
        break;
      case 'vertical-align':
        if (value === 'sub') {
          props.sub = true;
        }
        break;
      case 'font-style':
        switch (value) {
          case 'italic':
            props.italics = true;
            break;
        }
        break;
      case 'font-family': {
        const font = value.split(',').filter(f => !!f).map(f => f.replace(/["']/g, '').trim());
        props.font = font[0] || 'Roboto';
        break;
      }
      case 'color':
        props.color = value;
        break;
      case 'background':
      case 'background-color':
        if (table) {
          let layout = item.layout || {};
          if (typeof layout === 'string') {
            layout = {};
          }
          layout.fillColor = () => value;
          props.layout = layout;
        } else if (isTdOrTh(item)) {
          props.fillColor = value;
        } else {
          props.background = ['fill', value];
        }
        break;
      case 'margin': {
        const margin = expandValueToUnits(value)?.map(value => typeof value === 'string' ? 0 : value);
        if (margin) {
          computeMargin(props, item, margin[POS_TOP], POS_TOP);
          computeMargin(props, item, margin[POS_LEFT], POS_LEFT);
          computeMargin(props, item, margin[POS_RIGHT], POS_RIGHT);
          computeMargin(props, item, margin[POS_BOTTOM], POS_BOTTOM);
        }
        break;
      }
      case 'margin-left':
        computeMargin(props, item, toUnit(value), POS_LEFT);
        break;
      case 'margin-top':
        computeMargin(props, item, toUnit(value), POS_TOP);
        break;
      case 'margin-right':
        computeMargin(props, item, toUnit(value), POS_RIGHT);
        break;
      case 'margin-bottom':
        computeMargin(props, item, toUnit(value), POS_BOTTOM);
        break;
      case 'padding-left':
        computePadding(props, item, toUnit(value), POS_LEFT);
        break;
      case 'padding-top':
        computePadding(props, item, toUnit(value), POS_TOP);
        break;
      case 'padding-right':
        computePadding(props, item, toUnit(value), POS_RIGHT);
        break;
      case 'padding-bottom':
        computePadding(props, item, toUnit(value), POS_BOTTOM);
        break;
      case 'page-break-before':
        if (value === 'always') {
          props.pageBreak = 'before';
        }
        break;
      case 'page-break-after':
        if (value === 'always') {
          props.pageBreak = 'after';
        }
        break;
      case 'position':
        if (value === 'absolute') {
          meta[POSITION] = 'absolute';
          props.absolutePosition = {};
        } else if (value === 'relative') {
          meta[POSITION] = 'relative';
          props.relativePosition = {};
        }
        break;
      case 'left':
      case 'top':
        // TODO can be set before postion:absolute!
        if (!props.absolutePosition && !props.relativePosition) {
          console.error(directive + ' is set, but no absolute/relative position.');
          break;
        }

        if (props.absolutePosition) {
          if (directive === 'left') {
            props.absolutePosition.x = toUnit(value);
          } else if (directive === 'top') {
            props.absolutePosition.y = toUnit(value);
          }
        } else if (props.relativePosition) {
          if (directive === 'left') {
            props.relativePosition.x = toUnit(value);
          } else if (directive === 'top') {
            props.relativePosition.y = toUnit(value);
          }
        } else {
          console.error(directive + ' is set, but no absolute/relative position.');
          break;
        }
        break;
      case 'white-space':
        if (value === 'pre' && meta[NODE]) {
          if (text) {
            props.text = meta[NODE]?.textContent || '';
          }

          props.preserveLeadingSpaces = true;
        }
        break;

      case 'display':
        if (value === 'flex') {
          props[META][HANDLER] = handleColumns;
        } else if (value === 'none') {
          props[META][HANDLER] = () => null;
        }
        break;
      case 'opacity':
        props.opacity = Number(parseFloat(value));
        break;
      case 'gap':
        props.columnGap = toUnit(value);
        break;
      case 'list-style-type':
      case 'list-style':
        if (list) {
          props.type = value;
        } else {
          props.listType = value;
        }
        break;
      case 'width':
        if (table) {
          if (value === '100%') {
            item.table.widths = ['*'];
          } else {
            const width = toUnitOrValue(value);
            if (width !== null) {
              item.table.widths = [width];
            }
          }

        } else if (image) {
          props.width = toUnit(value);
        }
        break;
      case 'height':
        if (image) {
          props.height = toUnit(value);
        }
        break;
      case 'max-height':
        if (image) {
          props.maxHeight = toUnit(value);
        }
        break;
      case 'max-width':
        if (image) {
          props.maxWidth = toUnit(value);
        }
        break;
      case 'min-height':
        if (image) {
          props.minHeight = toUnit(value);
        }
        break;
      case 'min-width':
        if (image) {
          props.minWidth = toUnit(value);
        }
        break;
      case 'object-fit':
        if (value === 'contain' && image) {
          meta[HANDLER] = handleImg;
        }
        break;
      default:
        break;
    }
  });

  return props;
};