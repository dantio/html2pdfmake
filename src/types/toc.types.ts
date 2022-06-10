
import {Margin, TextProps} from './props.types.js';

export type TocTitle = TextProps & {
  text: string
  style?: string
  margin?: Margin
}
export type TocDefinition = {
  title: TocTitle
  numberStyle?: TextProps
}