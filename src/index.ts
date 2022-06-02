import {getPatterns} from './constants.js';
import {Context} from './context.js';
import {defaultConfig} from './default-config.js';
import {parseChildren} from './parser/index.js';
import {headerFooter, headerFooterContent} from './render/header-footer.js';
import {simpleRender} from './render/simple-render.js';
import {Config} from './types.js';
import {htmlToDom} from './utils/html-to-dom.js';

export {simpleRender};

export const getContext = (_config: Config = defaultConfig()) => {
  const config = {
    ...defaultConfig(),
    ..._config
  };

  return new Context(config);
};

export const parse = (input: Element | string, _config: Config = defaultConfig()) => {
  const root = typeof input === 'string' ? htmlToDom(input) : input;

  if (root?.nodeName === 'TEMPLATE' || root?.nodeName === 'HTML') {
    return parseTemplate(root, _config);
  }

  const ctx = getContext(_config);
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

export const parseTemplate = (template: Element, _config: Config = defaultConfig()) => {
  const ctx = getContext(_config);

  const root = template.nodeName === 'TEMPLATE' ? ctx.config.document().importNode((template as HTMLTemplateElement).content, true) : template;

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

    pageSize: pageSize?.getAttribute('content') || 'A4',
    pageOrientation: pageOrientation?.getAttribute('content') || 'portrait',
    pageMargins: margins,
  };
};