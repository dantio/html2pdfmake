import {
  BORDER,
  CLASSES,
  END_WITH_NEWLINE,
  END_WITH_WHITESPACE,
  IS_NEWLINE,
  IS_WHITESPACE,
  MARGIN,
  META,
  NODE,
  PADDING,
  PDFMAKE,
  POST_HANDLER,
  PRE_HANDLER,
  START_WITH_NEWLINE,
  START_WITH_WHITESPACE,
  STYLE,
  UID
} from '../constants.js';
import {El, Styles} from './global.types.js';
import {Item} from './item.types.js';
import {LazyItem} from './lazy-item.types.js';
import {Points} from './props.types.js';

export type MetaNode<T> = T & {
  [META]: {
    [NODE]: El
  }
}
export type Meta = {
  [NODE]?: El
  [UID]?: string

  [IS_WHITESPACE]?: string | boolean
  [END_WITH_NEWLINE]?: boolean
  [START_WITH_NEWLINE]?: boolean
  [IS_NEWLINE]?: boolean
  [START_WITH_WHITESPACE]?: boolean
  [END_WITH_WHITESPACE]?: boolean

  [MARGIN]?: Points
  [PADDING]?: Points
  [BORDER]?: Points

  [PRE_HANDLER]?: (item: MetaNode<LazyItem>) => MetaNode<LazyItem> | null
  [POST_HANDLER]?: (item: MetaNode<Item>) => MetaNode<Item> | null

  [STYLE]?: Styles
  [CLASSES]?: string[] // CSS classes from parent
  [PDFMAKE]?: Record<string, unknown>
}