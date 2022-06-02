import {META, STYLE} from '../constants.js';
import {globalStyles} from '../global-styles.js';
import {CssStyles, El, LazyItemNode, Styles} from '../types.js';
import {attrToProps} from './attr-to-props.js';
import {inheritStyle} from './inherit-style.js';
import {styleToProps} from './style-to-props.js';
import {selectStyles, getInlineStyles} from './styles.js';

/**
 *
 * @param el DOM Element
 * @param item
 * @param styles additional styles
 * @param parentStyles pick styles
 */
export const computeProps = (el: El, item: LazyItemNode, styles: CssStyles, parentStyles = {}) => {
  const rootStyles = styles[':root'] || globalStyles()[':root'];

  const attrProps = attrToProps(item);

  const selectors = (attrProps.style || []).concat(el.nodeName.toLowerCase());

  const elementStyles = selectStyles(selectors, styles);
  const inheritedStyles = inheritStyle(parentStyles);
  const cssStyles: Styles = Object.assign({}, elementStyles, inheritedStyles, getInlineStyles(el));

  const styleProps = styleToProps(item, cssStyles, rootStyles);

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


