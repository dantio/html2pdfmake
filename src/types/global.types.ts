import {Context} from '../context.js';
import {LazyItem} from './lazy-item.types.js';
import {ComputedProps} from './props.types.js';

export type El = Element | Node;
export type NodeRule = (el: El, ctx: Context) => LazyItem | null | undefined
export type StyleRule = (directive: string, value: string, props: ComputedProps) => boolean | undefined

export type Styles = Record<string, string | number>;
export type CssStyles = Record<string, Styles>;