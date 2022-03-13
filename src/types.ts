import {
  END_WITH_NEWLINE,
  END_WITH_WHITESPACE,
  HANDLER,
  IS_COLGROUP,
  IS_NEWLINE,
  IS_WHITESPACE,
  ITEMS,
  MARGIN,
  META,
  NODE,
  PADDING,
  PDFMAKE,
  POSITION,
  START_WITH_NEWLINE,
  START_WITH_WHITESPACE,
  STYLE,
  UID
} from './constants.js';
import {Context} from './context.js';

export type Config = {
  globalStyles?: CssStyles
  styles: CssStyles
  customRule?: Rule
  collapseMargin: boolean
  collapseWhitespace: boolean
}

export type El = Element | Node;
export type Rule = (el: El, ctx: Context) => Item | null

export type Styles = Record<string, string>;
export type CssStyles = Record<string, Styles>;

export type Margin = [number, number, number, number]

export type Meta = {
  [IS_WHITESPACE]?: string
  [END_WITH_NEWLINE]?: boolean
  [START_WITH_NEWLINE]?: boolean
  [IS_NEWLINE]?: boolean
  [START_WITH_WHITESPACE]?: boolean
  [END_WITH_WHITESPACE]?: boolean
  [NODE]?: El
  [UID]?: string
  [MARGIN]?: Margin
  [PADDING]?: Margin
  [POSITION]?: 'absolute' | 'relative'
  [IS_COLGROUP]?: boolean
  [ITEMS]?: Record<string, Item | Item[]>
  [HANDLER]?: (item: Item) => void
  [STYLE]?: Styles
  [PDFMAKE]?: Record<string, unknown>
}

export type TextProps = {
  bold?: boolean
  color?: string
  font?: string
  fontSize?: number
  fontFeatures?: string[]
  lineHeight?: number
  characterSpacing?: number
  alignment?: string
  sub?: boolean
  italics?: boolean
  preserveLeadingSpaces?: boolean
  decoration?: string
  decorationColor?: string
  decorationStyle?: string

  linkToDestination?: string
  link?: string
}

export type CommonProps = TextProps & {
  [META]?: Meta
  margin?: Margin,

  pageBreak?: string,
  opacity?: number

  absolutePosition?: Position
  relativePosition?: Position

  fit?: number[] | number
  width?: number | string
  height?: number

  border?: [boolean, boolean, boolean, boolean]
  borderColor?: [string, string, string, string]

  style?: string[]
};

export type ComputedProps = CommonProps & {
  [META]: Meta & { [STYLE]: Styles }

  text?: Text | Leaf

  fillColor?: string
  background?: [string, string]

  rowSpan?: number,
  colSpan?: number,

  counter?: number,
  start?: number,
  type?: string
  listType?: string

} & Omit<Table, 'table'>
  & Omit<Image, 'image'>
  & Omit<Column, 'columns'>;

export type Position = {
  x?: number
  y?: number
}

export type Image = {
  image: string
  maxHeight?: number
  maxWidth?: number
  minHeight?: number
  minWidth?: number
  /*  cover?: any*/
} & CommonProps;

export type Column = {
  columns: Array<ItemNode>
  columnGap?: number
} & CommonProps;

export type Ul = {
  ul: Item[]
} & CommonProps;

export type Ol = {
  ol: Item[]
} & CommonProps;

export type SVG = {
  svg: string
} & CommonProps;

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

export type Table = {
  table: TableDefinition,
  layout?: string | TableLayout
} & CommonProps;

export type Leaf = string & { [META]?: Meta }

export type Text = {
  text: Leaf | Array<Leaf | Text>,
  tocItem?: boolean
} & CommonProps;

export type Stack = {
  stack: Item[]
} & CommonProps;

export type QR = {
  qr: string
} & CommonProps;

export type TocTitle = TextProps & {
  text: string
  style?: string
  margin?: Margin
}

export type TocDefinition = {
  title: TocTitle
  numberStyle?: TextProps
}

export type Toc = {
  toc: TocDefinition
} & CommonProps;

export type ItemNode = Text | Stack | Table | Ul | Ol | SVG | Image | Column | QR | Toc;
export type Item = ItemNode | Leaf;
