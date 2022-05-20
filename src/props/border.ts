import {ComputedProps, LazyItemNode} from '../types.js';
import {isTable, isTdOrTh} from '../utils/type-guards.js';
import {toUnit} from '../utils/unit.js';

const getBorderStyle = (value: string) => {
  const border = value.split(' ');
  const color = border[2] || 'black';
  const borderStyle = border[1] || 'solid';
  const width = toUnit(border[0]);
  return {color, width, borderStyle};
};

export const computeBorder = (item: LazyItemNode, props: ComputedProps, directive: string, value: string) => {
  const {color, width, borderStyle} = getBorderStyle(value);
  const tdOrTh = isTdOrTh(item);

  const setBorder = (index: number) => {
    props.border = item.border || props.border || [false, false, false, false];
    props.borderColor = item.borderColor || props.borderColor || ['black', 'black', 'black', 'black'];
    if (value === 'none') {
      props.border[index] = false;
    } else {
      props.border[index] = true;
      props.borderColor[index] = color;
    }
  };

  switch (directive) {
    case 'border':
      if (isTable(item)) {
        props.layout = item.layout || props.layout || {};
        if (typeof props.layout === 'string') {
          props.layout = {};
        }
        if (value === 'none') {
          props.layout.hLineWidth = () => 0;
          props.layout.vLineWidth = () => 0;
          break;
        }

        props.layout.vLineColor = () => color;
        props.layout.hLineColor = () => color;
        props.layout.hLineWidth = (i, node) => (i === 0 || i === node.table.body.length) ? width : 0;
        props.layout.vLineWidth = (i, node) => (i === 0 || i === node.table.widths?.length) ? width : 0;
        if (borderStyle === 'dashed') {
          props.layout.hLineStyle = () => ({dash: {length: 2, space: 2}});
          props.layout.vLineStyle = () => ({dash: {length: 2, space: 2}});
        }
      } else if (tdOrTh) {
        setBorder(0);
        setBorder(1);
        setBorder(2);
        setBorder(3);
      }
      break;
    case 'border-bottom':
      if (isTable(item)) {
        props.layout = item.layout || props.layout || {};
        if (typeof props.layout === 'string') {
          props.layout = {};
        }
        const hLineWidth = props.layout.hLineWidth || (() => 0);
        const hLineColor = props.layout.hLineColor || (() => 'black');

        props.layout.hLineWidth = (i, node) => (i === node.table.body.length) ? width : hLineWidth(i, node);
        props.layout.hLineColor = (i, node) => (i === node.table.body.length) ? color : hLineColor(i, node);
      } else if (tdOrTh) {
        setBorder(3);
      }
      break;
    case 'border-top':
      if (isTable(item)) {
        const {color, width} = getBorderStyle(value);
        props.layout = item.layout || props.layout || {};
        if (typeof props.layout === 'string') {
          props.layout = {};
        }
        const hLineWidth = props.layout.hLineWidth || (() => 1);
        const hLineColor = props.layout.hLineColor || (() => 'black');

        props.layout.hLineWidth = (i, node) => (i === 0) ? width : hLineWidth(i, node);
        props.layout.hLineColor = (i, node) => (i === 0) ? color : hLineColor(i, node);
      } else if (tdOrTh) {
        setBorder(1);
      }
      break;
    case 'border-right':
      if (isTable(item)) {
        const {color, width} = getBorderStyle(value);
        props.layout = item.layout || props.layout || {};
        if (typeof props.layout === 'string') {
          props.layout = {};
        }
        const vLineWidth = props.layout.vLineWidth || (() => 1);
        const vLineColor = props.layout.vLineColor || (() => 'black');

        props.layout.vLineWidth = (i, node) => (node.table.body.length === 1 ? i === node.table.body.length : i % node.table.body.length !== 0) ? width : vLineWidth(i, node);
        props.layout.vLineColor = (i, node) => (node.table.body.length === 1 ? i === node.table.body.length : i % node.table.body.length !== 0) ? color : vLineColor(i, node);
      } else if (tdOrTh) {
        setBorder(2);
      }
      break;
    case 'border-left':
      if (isTable(item)) {
        const {color, width} = getBorderStyle(value);
        props.layout = item.layout || props.layout || {};
        if (typeof props.layout === 'string') {
          props.layout = {};
        }

        const vLineWidth = props.layout.vLineWidth || (() => 1);
        const vLineColor = props.layout.vLineColor || (() => 'black');

        props.layout.vLineWidth = (i, node) => (node.table.body.length === 1 ? i === 0 : i % node.table.body.length === 0) ? width : vLineWidth(i, node);
        props.layout.vLineColor = (i, node) => (node.table.body.length === 1 ? i === 0 : i % node.table.body.length === 0) ? color : vLineColor(i, node);
      } else if (tdOrTh) {
        setBorder(0);
      }
      break;
  }
};