import {TFontDictionary} from 'pdfmake/interfaces.js';
import {CssStyles, El, Rule} from './global.types.js';

export type Config = {
  globalStyles?: CssStyles
  styles: CssStyles
  customRule?: Rule

  collapseMargin: boolean
  collapseWhitespace: boolean

  render: (el: El, data: Record<string, unknown>) => El,
  document: () => Document,
  parseCss: (style: NodeListOf<HTMLStyleElement>) => CssStyles,

  defaultFont: string
  fonts?: TFontDictionary
}