import {
  BORDER,
  END_WITH_NEWLINE,
  END_WITH_WHITESPACE,
  HANDLER,
  IS_NEWLINE,
  IS_WHITESPACE,
  MARGIN,
  NODE,
  PADDING,
  PDFMAKE,
  START_WITH_NEWLINE,
  START_WITH_WHITESPACE,
  STYLE,
  UID
} from '../constants.js';
import {El, Styles} from './global.types.js';
import {Item} from './item.types.js';
import {Points} from './props.types.js';

export type Meta = {
  [IS_WHITESPACE]?: string | boolean
  [END_WITH_NEWLINE]?: boolean
  [START_WITH_NEWLINE]?: boolean
  [IS_NEWLINE]?: boolean
  [START_WITH_WHITESPACE]?: boolean
  [END_WITH_WHITESPACE]?: boolean
  [NODE]?: El
  [UID]?: string
  [MARGIN]?: Points
  [PADDING]?: Points
  [BORDER]?: Points
  [HANDLER]?: (item: Item) => Item | null
  [STYLE]?: Styles
  [PDFMAKE]?: Record<string, unknown>
}