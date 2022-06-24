import {META, PADDING, POS_BOTTOM, POS_LEFT, POS_RIGHT, POS_TOP} from '../constants.js';
import {LazyItem} from '../types/lazy-item.types.js';
import {ComputedProps} from '../types/props.types.js';
import {isTable, isTdOrTh} from '../utils/type-guards.js';
import {toUnit} from '../utils/unit.js';

const paddings: Record<string, number> = {
  'padding-top': POS_TOP,
  'padding-left': POS_LEFT,
  'padding-right': POS_RIGHT,
  'padding-bottom': POS_BOTTOM
};

export const computePadding = (item: LazyItem, props: ComputedProps, directive: string, input: string | number) => {
  const index = typeof paddings[directive] !== 'undefined' ? paddings[directive] : -1;
  const value = toUnit(input);

  if (isTable(item)) {
    props.layout = item.layout || props.layout || {};
    if (typeof props.layout === 'string') {
      props.layout = {};
    }
    switch (index) {
      case POS_LEFT:
        props.layout.paddingLeft = () => value;
        break;
      case POS_TOP:
        props.layout.paddingTop = () => value;
        break;
      case POS_RIGHT:
        props.layout.paddingRight = () => value;
        break;
      case POS_BOTTOM:
        props.layout.paddingBottom = () => value;
        break;
      default:
        throw new Error('Unsupported index for "' + directive + '": ' + index);
    }
  } else {
    const padding = props[META][PADDING] || item[META]?.[PADDING] || [0, 0, 0, 0];
    padding[index] = value;
    props[META][PADDING] = [...padding];

    if (!isTdOrTh(item)) {
      const margin = props.margin ?? [0, 0, 0, 0];
      props.margin = margin;
      const marginValue = margin[index];
      props.margin[index] = value + marginValue;
    }
  }
};