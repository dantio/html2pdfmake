import {Alignment, Decoration, DecorationStyle, Margins, PageBreak, Position, Size,} from 'pdfmake/interfaces.js';
import {META, STYLE} from '../constants.js';
import {Styles} from './global.types.js';
import {Column, Image, Leaf, Table, Text} from './item.types.js';
import {Meta} from './meta.types.js';

export type Points = [number, number, number, number]

export type OpenTypeFeatures = PDFKit.Mixins.OpenTypeFeatures[]

// TODO Same as Style
export type TextProps = {
  /** name of the font */
  font?: string | undefined;
  /** size of the font in pt */
  fontSize?: number | undefined;
  fontFeatures?: PDFKit.Mixins.OpenTypeFeatures[] | undefined;
  /** the line height (default: 1) */
  lineHeight?: number | undefined;
  /** whether to use bold text (default: false) */
  bold?: boolean | undefined;
  /** whether to use italic text (default: false) */
  italics?: boolean | undefined;
  /** the alignment of the text */
  alignment?: Alignment | undefined;
  /** the color of the text (color name e.g., ‘blue’ or hexadecimal color e.g., ‘#ff5500’) */
  color?: string | undefined;
  /** the background color of the text */
  background?: string | undefined | [string, string]; // TODO added [string, string]
  /** the color of the bullets in a buletted list */
  markerColor?: string | undefined;
  /** the text decoration to apply (‘underline’ or ‘lineThrough’ or ‘overline’) */
  decoration?: Decoration | undefined;
  /** (‘dashed’ or ‘dotted’ or ‘double’ or ‘wavy’) */
  decorationStyle?: DecorationStyle | undefined;
  /** the color of the text decoration, see color */
  decorationColor?: string | undefined;
  margin?: Margins | undefined;
  preserveLeadingSpaces?: boolean | undefined;
  preserveTrailingSpaces?: boolean | undefined;
  opacity?: number | undefined;
  characterSpacing?: number | undefined;
  leadingIndent?: number | undefined;
  // Table-cell properties:
  noWrap?: boolean | undefined;
  /** the background color of a table cell */
  fillColor?: string | undefined;
  /** the background opacity of a table cell */
  fillOpacity?: number | undefined;
  /** optional space between columns */
  columnGap?: Size | undefined;
  sup?: boolean | undefined;
  sub?: boolean | undefined;

  // ContentLink
  link?: string | undefined;
  linkToPage?: number | undefined;
  linkToDestination?: string | undefined;
}

export type CommonProps = TextProps & {
  [META]?: Meta
  margin?: Points,

  pageBreak?: PageBreak,

  absolutePosition?: Position
  relativePosition?: Position

  fit?: number[] | number
  width?: number | string
  height?: number

  border?: [boolean, boolean, boolean, boolean]
  borderColor?: [string, string, string, string]

  rowSpan?: number,
  colSpan?: number,

  style?: string[]
}

export type ComputedProps = CommonProps & {
  [META]: Meta & { [STYLE]: Styles }

  text?: Text | Leaf

  fillColor?: string
  counter?: number,
  start?: number,
  type?: string
  listType?: string
} & Omit<Table, 'table'>
  & Omit<Image, 'image'>
  & Omit<Column, 'columns'>;

