import {MARGIN, META, PADDING} from '../constants.js';
import {ComputedProps, LazyItem} from '../types.js';

export const computeMargin = (itemProps: ComputedProps, item: LazyItem, value: number, index: number) => {
  const margin = itemProps[META][MARGIN] || item[META]?.[MARGIN] || [0, 0, 0, 0];
  margin[index] = value;
  itemProps[META][MARGIN] = [...margin];
  itemProps.margin = margin;
  const padding = itemProps[META][PADDING] || item[META]?.[PADDING] || [0, 0, 0, 0];
  const paddingValue = padding[index] || 0;
  itemProps.margin[index] = value + paddingValue;
};