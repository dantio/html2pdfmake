import {CustomTableLayout, DynamicLayout} from 'pdfmake/interfaces.js';
import {BORDER, META, POS_BOTTOM, POS_LEFT, POS_RIGHT, POS_TOP} from '../constants.js';
import {LazyItemNode} from '../types/lazy-item.types.js';
import {ComputedProps} from '../types/props.types.js';
import {isTable} from '../utils/type-guards.js';
import {toUnit} from '../utils/unit.js';

const getBorderStyle = (value: string) => {
  const border = value.split(' ');
  const color = border[2] || 'black';
  const borderStyle = border[1] || 'solid';
  const width = toUnit(border[0]);
  return {color, width, borderStyle};
};

const colorLineLayout = (props: ComputedProps, l: 'h' | 'v') => {
  const layout: CustomTableLayout = typeof props.layout === 'string' ? {} : props.layout || {};
  const colorFn = l === 'h' ? layout.hLineColor : layout.vLineColor;
  const widthFn = l === 'h' ? layout.hLineWidth : layout.vLineWidth;

  const lineWidth = widthFn || (() => 0);
  const lineColor: DynamicLayout<string> = typeof colorFn === 'function'
    ? colorFn
    : () => typeof colorFn === 'string' ? colorFn : 'black';

  return {
    layout,
    lineWidth,
    lineColor
  };
};

export const computeBorder = (item: LazyItemNode, props: ComputedProps, directive: string, value: string) => {
  const {color, width, borderStyle} = getBorderStyle(value);
  const table = isTable(item);

  const setColumnBorder = (index: number) => {
    const borderWidth = props[META][BORDER] || [0, 0, 0, 0];
    props.border = item.border || props.border || [false, false, false, false];
    props.borderColor = item.borderColor || props.borderColor || ['black', 'black', 'black', 'black'];
    if (value === 'none') {
      props.border[index] = false;
    } else {
      props.border[index] = width > 0;
      props.borderColor[index] = color;
    }

    borderWidth[index] = width;

    props[META][BORDER] = borderWidth;
  };

  switch (directive) {
    case 'border':
      if (table) {
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
      } else {
        setColumnBorder(0);
        setColumnBorder(1);
        setColumnBorder(2);
        setColumnBorder(3);
      }
      break;
    case 'border-bottom':
      if (table) {
        props.layout = item.layout || props.layout || {};
        const {layout, lineWidth: hLineWidth, lineColor: hLineColor} = colorLineLayout(props, 'h');

        layout.hLineWidth = (i, node, columnIndex) => (i === node.table.body.length) ? width : hLineWidth(i, node, columnIndex);
        layout.hLineColor = (i, node, columnIndex) => (i === node.table.body.length) ? color : hLineColor(i, node, columnIndex);

        props.layout = layout;
      } else {
        setColumnBorder(POS_BOTTOM);
      }
      break;
    case 'border-top':
      if (table) {
        props.layout = item.layout || props.layout || {};
        const {layout, lineWidth: hLineWidth, lineColor: hLineColor} = colorLineLayout(props, 'h');

        layout.hLineWidth = (i, node, columnIndex) => (i === 0) ? width : hLineWidth(i, node, columnIndex);
        layout.hLineColor = (i, node, columnIndex) => (i === 0) ? color : hLineColor(i, node, columnIndex);

        props.layout = layout;
      } else {
        setColumnBorder(POS_TOP);
      }
      break;
    case 'border-right':
      if (table) {
        props.layout = item.layout || props.layout || {};
        const {layout, lineWidth: vLineWidth, lineColor: vLineColor} = colorLineLayout(props, 'v');

        layout.vLineWidth = (i, node, columnIndex) => (node.table.body.length === 1 ? i === node.table.body.length : i % node.table.body.length !== 0) ? width : vLineWidth(i, node, columnIndex);
        layout.vLineColor = (i, node, columnIndex) => (node.table.body.length === 1 ? i === node.table.body.length : i % node.table.body.length !== 0) ? color : vLineColor(i, node, columnIndex);

        props.layout = layout;
      } else {
        setColumnBorder(POS_RIGHT);
      }
      break;
    case 'border-left':
      if (table) {
        props.layout = item.layout || props.layout || {};
        const {layout, lineWidth: vLineWidth, lineColor: vLineColor} = colorLineLayout(props, 'v');

        layout.vLineWidth = (i, node, columnIndex) => (node.table.body.length === 1 ? i === 0 : i % node.table.body.length === 0) ? width : vLineWidth(i, node, columnIndex);
        layout.vLineColor = (i, node, columnIndex) => (node.table.body.length === 1 ? i === 0 : i % node.table.body.length === 0) ? color : vLineColor(i, node, columnIndex);

        props.layout = layout;
      } else {
        setColumnBorder(POS_LEFT);
      }
      break;
  }
};