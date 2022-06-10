
import {CssStyles, El, Styles} from '../types/global.types.js';

/**
 * @param el DOM Element
 */
export const getInlineStyles = (el: El): Styles => ('getAttribute' in el ? el.getAttribute('style') || '' : '').split(';')
  .map(style => style.trim().split(':'))
  .filter(style => style.length === 2)
  .reduce((style: Styles, value) => {
    style[value[0].trim().toLowerCase()] = value[1].trim();
    return style;
  }, {});

export const selectStyles = (selectors: string[], styles: CssStyles): Styles =>
  selectors
    .filter((selector) => styles && styles[selector])
    .reduce((style: Styles, selector: string) => {
      return {
        ...style,
        ...styles[selector]
      };
    }, {} as Styles);