export const META = Symbol('__HTML2PDFMAKE');
export const NODE = 'NODE';
export const UID = 'UID';
export const END_WITH_NEWLINE = 'END_WITH_NEWLINE';
export const START_WITH_NEWLINE = 'START_WITH_NEW_LINE';
export const IS_NEWLINE = 'IS_NEWLINE';
export const START_WITH_WHITESPACE = 'START_WITH_WHITESPACE';
export const END_WITH_WHITESPACE = 'END_WITH_WHITESPACE';
export const IS_WHITESPACE = 'IS_WHITESPACE';
export const IS_INPUT = 'IS_INPUT';
export const MARGIN = 'MARGIN';
export const PADDING = 'PADDING';
export const BORDER = 'BORDER';
export const POST_HANDLER = 'POST_HANDLER';
export const PRE_HANDLER = 'PRE_HANDLER';
export const PDFMAKE = 'PDFMAKE';
export const STYLE = 'STYLE';
export const CLASSES = 'CLASSES';

export const POS_TOP = 1; // CSS 0
export const POS_RIGHT = 2; // CSS 1
export const POS_BOTTOM = 3; // CSS 2
export const POS_LEFT = 0; // CSS 3

export const getPatterns = () => ({
  fill: {
    boundingBox: [1, 1, 4, 4],
    xStep: 1,
    yStep: 1,
    pattern: '1 w 0 1 m 4 5 l s 2 0 m 5 3 l s'
  }
});