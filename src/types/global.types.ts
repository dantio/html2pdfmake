import {Context} from '../context.js';
import {LazyItem} from './lazy-item.types.js';

export type El = Element | Node;
export type Rule = (el: El, ctx: Context) => LazyItem | null

export type Styles = Record<string, string>;
export type CssStyles = Record<string, Styles>;

