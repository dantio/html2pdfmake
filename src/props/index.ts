import {META, STYLE} from '../constants.js';
import {Context} from '../context.js';
import {globalStyles} from '../global-styles.js';
import {El, Styles} from '../types/global.types.js';
import {LazyItem, LazyItemNode} from '../types/lazy-item.types.js';
import {attrToProps} from './attr-to-props.js';
import {inheritStyle} from './inherit-style.js';
import {styleToProps} from './style-to-props.js';
import {getInlineStyles, selectStyles} from './styles.js';

/**
 *
 * @param el DOM Element
 * @param item
 * @param ctx the context
 * @param parentItem the parent item
 */
export const computeProps = (el: El, item: LazyItemNode, ctx: Context, parentItem?: LazyItem) => {
  const styles = ctx.styles;
  const rootStyles = styles[':root'] || globalStyles()[':root'];

  const attrProps = attrToProps(item);

  // TODO improve sort by specificity
  const selectors = (attrProps.style || []).concat(el.nodeName.toLowerCase()).sort().reverse();

  const elementStyles = selectStyles(selectors, styles);
  const inheritedStyles = inheritStyle(el, parentItem);
  const cssStyles: Styles = Object.assign({}, elementStyles, inheritedStyles, getInlineStyles(el));

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


