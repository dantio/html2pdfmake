import {CssStyles, El, LazyItemNode, Styles} from '../types.js';

/**
 * @param el DOM Element
 */
export const getInlineStyles = (el: El): Styles => ('getAttribute' in el ? el.getAttribute('style') || '' : '').split(';')
  .map(style => style.trim().toLowerCase().split(':'))
  .filter(style => style.length === 2)
  .reduce((style: Styles, value) => {
    style[value[0].trim()] = value[1].trim();
    return style;
  }, {});

export const getDefaultStyles = (el: El, item: LazyItemNode, styles: CssStyles): Styles =>
  (item.style || []).concat(el.nodeName.toLowerCase())
    .filter((selector) => styles && styles[selector])
    .reduce((style: Styles, selector: string) => {
      return {
        ...style,
        ...styles[selector]
      };
    }, {} as Styles);