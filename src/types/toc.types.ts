import {TableOfContent} from 'pdfmake/interfaces.js';
import {Points, TextProps} from './props.types.js';

export type TocTitle = TextProps & {
  text: string
  style?: string
  margin?: Points
}

export type TocDefinition = TableOfContent & {
  title?: TocTitle
}