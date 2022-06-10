import {META, STYLE} from '../constants.js';
import {Styles} from './global.types.js';
import {Column, Image, Leaf, Table, Text} from './item.types.js';
import {Meta} from './meta.types.js';

export type Margin = [number, number, number, number]

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