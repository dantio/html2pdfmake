import {Alignment, DecorationStyle} from 'pdfmake/interfaces.js';
import {META, NODE, POS_BOTTOM, POS_LEFT, POS_RIGHT, POS_TOP, POST_HANDLER, PRE_HANDLER, STYLE} from '../constants.js';
import {Context} from '../context.js';
import {handleColumns, handleImg} from '../handler/index.js';
import {Styles} from '../types/global.types.js';
import {LazyItemNode} from '../types/lazy-item.types.js';
import {ComputedProps, OpenTypeFeatures} from '../types/props.types.js';
import {parseColor} from '../utils/color.js';
import {isImage, isList, isTable, isTdOrTh, isTextSimple} from '../utils/type-guards.js';
import {expandValueToUnits, toUnit, toUnitOrValue} from '../utils/unit.js';
import {computeBorder} from './border.js';
import {computeMargin} from './margin.js';
import {computePadding} from './padding.js';

export const styleToProps = (item: LazyItemNode, ctx: Context, styles: Styles, rootStyles: Styles = {}) => {
  const props: ComputedProps = {
    [META]: {
      ...(item[META] || {}),
      [STYLE]: {},
      ...(item[META]?.[STYLE] || {}),
    }
  };

  const meta = props[META];
  const image = isImage(item);
  const table = isTable(item);
  const text = isTextSimple(item);
  const list = isList(item);
  const rootFontSize = toUnit(rootStyles['font-size'] || '16px');

  Object.keys(styles).forEach((key: string) => {
    const directive = key;
    const value = ('' + styles[key]).trim();

    props[META][STYLE][directive] = value;

    if (typeof ctx.config.styleRule === 'function' && ctx.config.styleRule(directive, value, props)) {
      return;
    }

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
          layout.paddingBottom = (i: number, node) => (i === node.table.body.length - 1) ? Number(paddings[POS_BOTTOM]) : 0;
          props.layout = layout;
        } else if (paddings !== null) {
          computePadding(item, props, 'padding-top', Number(paddings[POS_TOP]));
          computePadding(item, props, 'padding-left', Number(paddings[POS_LEFT]));
          computePadding(item, props, 'padding-right', Number(paddings[POS_RIGHT]));
          computePadding(item, props, 'padding-bottom', Number(paddings[POS_BOTTOM]));
        }
        break;
      }
      case 'padding-left':
      case 'padding-top':
      case 'padding-right':
      case 'padding-bottom':
        computePadding(item, props, directive, value);
        break;
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
        if (value !== 'inherit') { // TODO handle inherit
          props.lineHeight = toUnit(value, rootFontSize);
        }
        break;
      case 'letter-spacing':
        props.characterSpacing = toUnit(value);
        break;
      case 'text-align':
        if (['left', 'right', 'justify', 'center'].includes(value)) {
          props.alignment = value as Alignment;
        }
        break;
      case 'font-feature-settings': {
        const settings = value.split(',').filter(s => s).map(s => s.replace(/['"]/g, '')) as OpenTypeFeatures;
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
        props.decorationColor = parseColor(value);
        break;
      case 'text-decoration-style':
        if (['dashed', 'dotted', 'double', 'wavy'].includes(value)) {
          props.decorationStyle = value as DecorationStyle;
        }
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
        if (ctx.fonts) {
          props.font = Object.keys(ctx.fonts).find(f => font.includes(f)) || ctx.config.defaultFont;
        } else {
          props.font = font[0] || ctx.config.defaultFont;
        }
        break;
      }
      case 'color':
        props.color = parseColor(value);
        break;
      case 'background':
      case 'background-color':
        if (table) {
          let layout = item.layout || {};
          if (typeof layout === 'string') {
            layout = {};
          }
          layout.fillColor = () => parseColor(value);
          props.layout = layout;
        } else if (isTdOrTh(item)) {
          props.fillColor = parseColor(value);
        } else {
          props.background = ['fill', parseColor(value)];
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
      case 'position': {
        const x = toUnit(styles['left'] || 0);
        const y = toUnit(styles['top'] || 0);

        if (value === 'absolute') {
          props.absolutePosition = {
            x,
            y
          };
        } else if (value === 'relative') {
          props.relativePosition = {
            x,
            y
          };
        }
        break;
      }
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
          props[META][POST_HANDLER] = handleColumns;
        } else if (value === 'none') {
          props[META][PRE_HANDLER] = () => null;
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
          const width = toUnitOrValue(value);
          if (width !== null) {
            item.table.widths = [width];
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
          meta[POST_HANDLER] = handleImg;
        }
        break;
      default:
        break;
    }
  });

  return props;
};