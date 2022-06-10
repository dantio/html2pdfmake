import {IS_WHITESPACE, META} from '../constants.js';

const WHITESPACE = ' ';
export const addWhitespace = (type: string) => ({
  text: WHITESPACE,
  [META]: {
    [IS_WHITESPACE]: type
  }
});