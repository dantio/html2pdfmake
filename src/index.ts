import {getPatterns} from './constants.js';
import {Context} from './context.js';
import {defaultConfig} from './default-config.js';
import {parseChildren} from './parser/index.js';
import {Config} from './types.js';
import {htmlToDom} from './utils/html-to-dom.js';

export const parse = (input: Element | string, _config: Config = defaultConfig()) => {
  const config = {
    ...defaultConfig,
    ..._config
  };

  const ctx = new Context(config, Object.assign({}, config.globalStyles, config.styles));

  const body = typeof input === 'string' ? htmlToDom(input) : input;

  const content = body !== null ? parseChildren(body, ctx) : [];


  return {
    content,
    images: ctx.images,
    patterns: getPatterns()
  };
};