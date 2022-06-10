import {META, STYLE} from '../constants.js';
import {Context} from '../context.js';
import {globalStyles} from '../global-styles.js';
import {El, Styles} from '../types/global.types.js';
import {LazyItemNode} from '../types/lazy-item.types.js';
import {attrToProps} from './attr-to-props.js';
import {inheritStyle} from './inherit-style.js';
import {styleToProps} from './style-to-props.js';
import {getInlineStyles, selectStyles} from './styles.js';

/**
 *
 * @param el DOM Element
 * @param item
 * @param ctx the context
 * @param parentStyles pick styles
 */
export const computeProps = (el: El, item: LazyItemNode, ctx: Context, parentStyles = {}) => {
  const styles = ctx.styles;
  const rootStyles = styles[':root'] || globalStyles()[':root'];

  const attrProps = attrToProps(item);

  const selectors = (attrProps.style || []).concat(el.nodeName.toLowerCase());

  const elementStyles = selectStyles(selectors, styles);
  const inheritedStyles = inheritStyle(parentStyles, el);
  const cssStyles: Styles = Object.assign({}, elementStyles, inheritedStyles, getInlineStyles(el));

  const styleProps = styleToProps(item, ctx, cssStyles, rootStyles);

  const props = {
    ...styleProps,
    ...attrProps,
    [META]: {
      ...(styleProps[META] || {}),
      ...(attrProps[META] || {}),
      [STYLE]: {
        ...(styleProps[META][STYLE] || {}),
        ...(attrProps[META][STYLE] || {}),
      }
    }
  };

  return {
    cssStyles,
    props
  };
};


