import {Context} from '../context.js';
import {parseChildren} from '../parser/index.js';
import {Item} from '../types.js';

type HeaderFooter = Record<string | number, (data: Record<string, unknown>) => Item[]>

export const headerFooterContent = (els: NodeListOf<Element>, ctx: Context): HeaderFooter => {
  const elements: HeaderFooter = {};

  let index = 1;
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    let dataPage: string | null = el.getAttribute('data-page');
    let page: string | number = index;

    if (dataPage) {
      const num = parseInt(dataPage, 10);
      if (['even', 'odd', 'default'].includes(dataPage)) {
        page = dataPage;
      } else if (!isNaN(num)) {
        page = num;
      } else {
        page = index++;
      }
    } else {
      page = index++;
    }

    elements[page] = (data) => {
      return parseChildren(ctx.config.render(el, data), ctx);
    };
  }

  return elements;
};

export const headerFooter = (currentPage: number, pageCount: number, headerOrFooter: HeaderFooter) => {
  const evenOdd = currentPage % 2 === 0 ? 'even' : 'odd';
  const data = {
    currentPage,
    pageCount
  };

  return headerOrFooter[evenOdd]?.(data) || headerOrFooter[currentPage]?.(data) || headerOrFooter['default']?.(data) || [];
};