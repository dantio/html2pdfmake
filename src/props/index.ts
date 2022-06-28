import {META, NODE, STYLE} from '../constants.js';
import {Context} from '../context.js';
import {globalStyles} from '../global-styles.js';
import {Styles} from '../types/global.types.js';
import {LazyItem, LazyItemNode} from '../types/lazy-item.types.js';
import {MetaNode} from '../types/meta.types.js';
import {attrToProps} from './attr-to-props.js';
import {inheritStyle} from './inherit-style.js';
import {styleToProps} from './style-to-props.js';
import {getInlineStyles, selectStyles} from './styles.js';

/**
 *
 * @param item
 * @param ctx the context
 * @param parentItem? the parent item
 */
export const computeProps = (item: MetaNode<LazyItemNode>, ctx: Context, parentItem?: LazyItem) => {
  const el = item[META][NODE];

  const styles = ctx.styles;
  const rootStyles = styles[':root'] || globalStyles()[':root'];

  const attrProps = attrToProps(item, parentItem);

  // TODO improve sort by specificity
  const selectors = (attrProps.style || []).concat(el.nodeName.toLowerCase()).sort().reverse();

  const elementStyles = selectStyles(selectors, styles);
  const inheritedStyles = inheritStyle(el, parentItem);
  const cssStyles: Styles = Object.assign({}, rootStyles, inheritedStyles, elementStyles, getInlineStyles(el));

  const styleProps = styleToProps(item, ctx, cssStyles, rootStyles);

  return {
    ...styleProps,
    ...attrProps,
    [META]: {
      ...(styleProps[META] || {}),
      ...(attrProps[META] || {}),
      ...(item[META] || {}),
      [STYLE]: {
        ...(styleProps[META][STYLE] || {}),
        ...(attrProps[META][STYLE] || {}),
      }
    }
  };
};


