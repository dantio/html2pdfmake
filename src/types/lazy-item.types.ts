import {Context} from '../context.js';
import {Column, Image, Item, Leaf, Ol, QR, Stack, SVG, Table, Text, Toc, Ul} from './item.types.js';
import {TableDefinition} from './table.types.js';

export type Evaluate<T, R> = (items: T, ctx: Context, item: LazyItem) => R;

export type LazyItems = Evaluate<Item[], Item[]>// (items: Item[], parentItem: LazyItem, ctx: Context) => Item[]
export type LazyTxt = Evaluate<Array<Text | Leaf>, Leaf | Array<Leaf | Text>>// (items: Array<Text | Leaf>, ctx: Context) => Leaf | Array<Leaf | Text>
export type LazyTableItems = Evaluate<Item[], Array<Item[] | Leaf[]>> // (items: Item[], ctx: Context) => Array<Item[] | Leaf[]>
export type LazyUl = Ul | Omit<Ul, 'ul'> & { ul: LazyItems };
export type LazyOl = Ol | Omit<Ol, 'ol'> & { ol: LazyItems };
export type LazyStack = Stack | Omit<Stack, 'stack'> & { stack: LazyItems }
export type LazyText = Text | Omit<Text, 'text'> & { text: LazyTxt };
export type LazyTable = Table | Omit<Table, 'table'> & { table: LazyTableDefinition }
export type LazyItemNode = LazyText | LazyStack | LazyTable | LazyUl | LazyOl | SVG | Image | Column | QR | Toc;
export type LazyItem = LazyItemNode | Leaf;
export type LazyTableDefinition = Omit<TableDefinition, 'body'> & { body: LazyTableItems }