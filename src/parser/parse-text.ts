import {END_WITH_NEWLINE, END_WITH_WHITESPACE, META, START_WITH_NEWLINE, START_WITH_WHITESPACE} from '../constants.js';

export const parseText = (el: Element | Node) => {
  const text = el.textContent;
  if (text === null) {
    return null;
  }

  const keepNewLines = text.replace(/[^\S\r\n]+/, '');

  return {
    text: text.replace(/\n|\t|\s+/g, ' ').trim(),
    [META]: {
      [END_WITH_NEWLINE]: keepNewLines[keepNewLines.length - 1] === '\n',
      [END_WITH_WHITESPACE]: text[text.length - 1] === ' ',
      [START_WITH_WHITESPACE]: text[0] === ' ',
      [START_WITH_NEWLINE]: keepNewLines[0] === '\n'
    },
  };
};