import {Item, Leaf, Table} from './item.types.js';

export type TableDefinition = {
  body: Array<Item[] | Leaf[]>
  widths?: Array<number | string>
  heights?: Array<number | string>
}

export type Line = {
  length: number
  space: number
}

export type TableLayout = {
  defaultBorder?: boolean
  hLineWidth?: (i: number, node: Table) => number
  vLineWidth?: (i: number, node: Table) => number
  hLineColor?: (i: number, node: Table) => string
  vLineColor?: (i: number, node: Table) => string

  paddingLeft?: (i: number, node: Table) => number
  paddingRight?: (i: number, node: Table) => number
  paddingTop?: (i: number, node: Table) => number
  paddingBottom?: (i: number, node: Table) => number

  hLineStyle?: (i: number, node: Table) => Record<'dash', Line>
  vLineStyle?: (i: number, node: Table) => Record<'dash', Line>

  fillColor?: (rowIndex: number, node: Table, columnIndex: number) => string | number
}
