import {META} from '../constants.js';
import {Meta} from './meta.types.js';
import {CommonProps, Margin} from './props.types.js';
import {TableDefinition, TableLayout} from './table.types.js';
import {TocDefinition} from './toc.types.js';

export type Image = {
  image: string
  maxHeight?: number
  maxWidth?: number
  minHeight?: number
  minWidth?: number
  /*  cover?: any*/
} & CommonProps;

export type Column = { columns: Array<ItemNode>, columnGap?: number} & CommonProps;
export type Leaf = string & { [META]?: Meta }
export type Text = { text: Leaf | Array<Leaf | Text>, tocItem?: boolean } & CommonProps;
export type Stack = { stack: Item[] } & CommonProps;
export type QR = { qr: string } & CommonProps;
export type Ul = { ul: Item[] } & CommonProps;
export type Ol = { ol: Item[] } & CommonProps;
export type SVG = { svg: string } & CommonProps;
export type Toc = { toc: TocDefinition } & CommonProps;
export type Table = { table: TableDefinition, layout?: string | TableLayout} & CommonProps;

export type TextArray = Omit<Text, 'text'> & { text: Array<Leaf | Text> }
export type ItemNode = Text | Stack | Table | Ul | Ol | SVG | Image | Column | QR | Toc;
export type ItemCollapsable = ItemNode & { margin: Margin };
export type Item = ItemNode | Leaf;


