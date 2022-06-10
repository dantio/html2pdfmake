import {
  END_WITH_NEWLINE,
  END_WITH_WHITESPACE,
  IS_NEWLINE,
  IS_WHITESPACE,
  META,
  START_WITH_NEWLINE,
  START_WITH_WHITESPACE
} from '../constants.js';
import {Text} from '../types/item.types.js';

export const parseText = (el: Element | Node): Text | null => {
  const text = el.textContent;
  if (text === null) {
    return null;
  }

  const keepNewLines = text.replace(/[^\S\r\n]+/, '');
  const trimmedText = text.replace(/\n|\t| +/g, ' ')
    .replace(/^ +/, '')
    .replace(/ +$/, '');
  //.trim() removes also &nbsp;
  const endWithNL = keepNewLines.at(-1) === '\n';
  const startWithNL = keepNewLines[0] === '\n';
  const startWithWhitespace = text[0] === ' ';
  const endWithWhitespace = text.at(-1) === ' ';

  return {
    text: trimmedText,
    [META]: {
      [START_WITH_NEWLINE]: startWithNL,
      [END_WITH_NEWLINE]: endWithNL,
      [IS_NEWLINE]: startWithNL && trimmedText.length === 0,
      [START_WITH_WHITESPACE]: startWithWhitespace,
      [END_WITH_WHITESPACE]: endWithWhitespace,
      [IS_WHITESPACE]: startWithWhitespace && text.length === 1,
    },
  };
};