import {MARGIN, META, PADDING, POS_BOTTOM, POS_LEFT, POS_RIGHT, POS_TOP} from '../constants.js';
import {ComputedProps, Item} from '../types.js';
import {toUnit} from '../utils/unit.js';
import {isTable, isTdOrTh} from '../utils/type-guards.js';

export const computePadding = (props: ComputedProps, item: Item, value: number, index: number) => {
  if (isTable(item)) {
    props.layout = item.layout || props.layout || {};
    if (typeof props.layout === 'string') {
      props.layout = {};
    }
    switch (index) {
      case POS_LEFT:
        props.layout.paddingLeft = () => toUnit(value);
        break;
      case POS_TOP:
        props.layout.paddingTop = () => toUnit(value);
        break;
      case POS_RIGHT:
        props.layout.paddingRight = () => toUnit(value);
        break;
      case POS_BOTTOM:
        props.layout.paddingBottom = () => toUnit(value);
        break;
      default:
        throw new Error('Unsupported index for padding: ' + index);
    }
  } else {
    const padding = props[META][PADDING] || item[META]?.[PADDING] || [0, 0, 0, 0];
    padding[index] = value;
    props[META][PADDING] = [...padding];

    if (!isTdOrTh(item)) {
      const margin = props[META][MARGIN] || item[META]?.[MARGIN] || [0, 0, 0, 0];
      props.margin = margin;
      const marginValue = margin[index];
      props.margin[index] = value + marginValue;
    }
  }
};