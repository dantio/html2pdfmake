import {Size, Table} from 'pdfmake/interfaces.js';
import {Item, Leaf} from './item.types.js';

export interface TableDefinition extends Omit<Table, 'heights' | 'body'> {
  body: Array<Item[] | Leaf[]>;
  heights?: Size[] | undefined;
}