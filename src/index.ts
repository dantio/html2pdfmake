import {PredefinedPageSize} from 'pdfmake/interfaces.js';
import {getPatterns} from './constants.js';
import {createContext} from './context.js';
import {defaultConfig} from './default-config.js';
import {parseChildren} from './parser/index.js';
import {headerFooter, headerFooterContent} from './render/header-footer.js';
import {simpleRender} from './render/simple-render.js';
import {Config} from './types/config.types';
import {DocDefinition} from './types/doc.types.js';
import {htmlToDom} from './utils/html-to-dom.js';

export {simpleRender, getPatterns};

export const parse = (input: Document | Element | string, _config: Partial<Config> = defaultConfig()): DocDefinition => {
  const root = typeof input === 'string' ? htmlToDom(input) : input;

  if (root?.nodeName === 'TEMPLATE' || root?.nodeName === 'HTML' || root?.nodeName === '#document') {
    return parseTemplate(root, _config);
  }

  const ctx = createContext(_config);
  const content = root !== null ? parseChildren(root, ctx) : [];

  return {
    info: {
      title: 'PDF Document - created by html2pdfmake',
      creator: 'html2pdfmake',
      producer: 'html2pdfmake',
    },
    content,
    images: ctx.images,
    patterns: getPatterns(),

    pageSize: 'A4',
    pageOrientation: 'portrait',

    header: () => [],
    footer: () => [],
    pageMargins: [40, 60, 40, 60]
  };
};

export const parseTemplate = (template: Element | Document, _config: Partial<Config> = defaultConfig()): DocDefinition => {
  const ctx = createContext(_config);

  const root = template.nodeName === 'TEMPLATE'
    ? ctx.config.document().importNode((template as HTMLTemplateElement).content, true)
    : template.nodeName === '#document' ? (template as Document).documentElement : template;

  const headers = headerFooterContent(root.querySelectorAll(':scope > header, body > header'), ctx);
  const footers = headerFooterContent(root.querySelectorAll(':scope > footer, body > footer'), ctx);

  const styles = root.querySelectorAll('style');

  ctx.setPageStyles(ctx.config.parseCss(styles));

  const main = root.querySelector('main');
  const title = root.querySelector('title');
  const author = root.querySelector('meta[name="author"]');
  const subject = root.querySelector('meta[name="description"]');
  const keywords = root.querySelector('meta[name="keywords"]');
  const pageSize = root.querySelector('meta[name="page-size"]');
  const pageOrientation = root.querySelector('meta[name="page-orientation"]');
  const pageMargins = root.querySelector('meta[name="page-margins"]');
  const margins = pageMargins?.getAttribute('content')?.split(',').filter(m => m).map(m => parseFloat(m)) || [40, 60, 40, 60];

  const info = {
    title: title?.textContent || 'PDF Document - created by html2pdfmake',
    author: author?.getAttribute('content') || 'html2pdfmake',
    subject: subject?.getAttribute('content') || 'Created by html2pdfmake',
    keywords: keywords?.getAttribute('content') || 'html2pdfmake',
    creator: 'html2pdfmake',
    producer: 'html2pdfmake',
  };

  const content = main !== null ? parseChildren(main, ctx) : [];

  return {
    header(currentPage: number, pageCount: number) {
      return headerFooter(currentPage, pageCount, headers);
    },
    footer(currentPage: number, pageCount: number) {
      return headerFooter(currentPage, pageCount, footers);
    },
    info,
    content,
    images: ctx.images,
    patterns: getPatterns(),

    pageSize: pageSize?.getAttribute('content') as PredefinedPageSize || 'A4',
    pageOrientation: pageOrientation?.getAttribute('content') === 'landscape' ? 'landscape' : 'portrait',
    pageMargins: margins,
  };
};