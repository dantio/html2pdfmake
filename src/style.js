const {expandProperty, toIntOrStr} = require('./utils.js');

const computeStyleProperty = (o, directive, value) => {
  directive = directive.trim();
  value = value.trim();

  switch (directive) {
    case 'padding':
      if (o.table) {
        o.layout = o.layout || {};
        const paddings = expandProperty(value);

        o.layout.paddingLeft = () => paddings[0];
        o.layout.paddingRight = () => paddings[2];
        o.layout.paddingTop = (i) => (i === 0) ? paddings[1] : 0;
        o.layout.paddingBottom = (i, node) => (i === node.table.body.length - 1) ? paddings[3] : 0;
      }

      break;
    case 'border':
      if (o.table) {
        o.layout = o.layout || {};
        if (value === 'none') {
          o.layout.defaultBorder = false;
          o.layout.hLineWidth = () => 0;
          o.layout.vLineWidth = () => 0;
          break;
        }

        const border = value.split(' '),
          color = border[2] || 'black',
          style = border[1] || 'solid',
          width = parseInt(border[0], 10);
        o.layout = o.layout || {};
        o.layout.vLineColor = () => color;
        o.layout.hLineColor = () => color;
        o.layout.hLineWidth = (i, node) => (i === 0 || i === node.table.body.length) ? width : 0;
        o.layout.vLineWidth = (i, node) => (i === 0 || i === node.table.widths.length) ? width : 0;
      }

      if (o._el === 'td') {
        o.border = [false, false, false, false];
      }

      break;
    case 'border-bottom':
      if (o.table) {
        const border = value.split(' '),
          color = border[2] || 'black',
          style = border[1] || 'solid',
          width = parseInt(border[0]);
        o.layout = o.layout || {};
        let hLineWidth = o.layout.hLineWidth;

        if (typeof hLineWidth !== 'function') {
          hLineWidth = () => 0;
        }

        o.layout.hLineWidth = (i, node) => (i === node.table.body.length) ? width : hLineWidth(i, node);

        let hLineColor = o.layout.hLineColor;
        if (typeof hLineColor !== 'function') {
          hLineColor = () => 'white';
        }

        o.layout.hLineColor = (i, node) => (i === node.table.body.length) ? color : hLineColor(i, node);
      }
      break;
    case 'border-top':
      if (o.table) {
        const border = value.split(' '),
          color = border[2] || 'black',
          style = border[1] || 'solid',
          width = parseInt(border[0]);
        o.layout = o.layout || {};
        let hLineWidth = o.layout.hLineWidth;
        if (typeof hLineWidth !== 'function') {
          hLineWidth = () => 0;
        }

        o.layout.hLineWidth = (i, node) => (i === 0) ? width : hLineWidth(i, node);

        let hLineColor = o.layout.hLineColor;
        if (typeof hLineColor !== 'function') {
          hLineColor = () => 'white';
        }

        o.layout.hLineColor = (i, node) => (i === 0) ? color : hLineColor(i, node);
      }
      break;
    case 'border-right':
      if (o.table) {
        const border = value.split(' '),
          color = border[2] || 'black',
          style = border[1] || 'solid',
          width = parseInt(border[0]);
        o.layout = o.layout || {};
        let vLineWidth = o.layout.vLineWidth;
        if (typeof vLineWidth !== 'function') {
          vLineWidth = () => 0;
        }

        o.layout.vLineWidth = (i, node) => (i % node.table.body.length !== 0) ? width : vLineWidth(i, node);

        let vLineColor = o.layout.vLineColor;
        if (typeof vLineColor !== 'function') {
          vLineColor = () => 'white';
        }
        o.layout.vLineColor = (i, node) => (i % node.table.body.length !== 0) ? color : vLineColor(i, node);
      }
      break;
    case 'border-left':
      if (o.table) {
        const border = value.split(' '),
          color = border[2] || 'black',
          style = border[1] || 'solid',
          width = parseInt(border[0]);
        o.layout = o.layout || {};

        let vLineWidth = o.layout.vLineWidth;
        if (typeof vLineWidth !== 'function') {
          vLineWidth = () => 0;
        }
        o.layout.vLineWidth = (i, node) => (i % node.table.body.length === 0) ? width : vLineWidth(i, node);

        let vLineColor = o.layout.vLineColor;
        if (typeof vLineColor !== 'function') {
          vLineColor = () => 'white';
        }

        o.layout.vLineColor = (i, node) => (i % node.table.body.length === 0) ? color : vLineColor(i, node);
      }
      break;
    case 'font-size':
      o.fontSize = parseInt(value);
      break;
    case 'text-align':
      switch (value) {
        case 'right':
          o.alignment = 'right';
          break;
        case 'center':
          o.alignment = 'center';
          break;
        case 'justify':
          o.alignment = 'justify';
          break;
      }
      break;
    case 'font-weight':
      switch (value) {
        case 'bold':
          o.bold = true;
          break;
      }
      break;
    case 'text-decoration':
      // decorationStyle: double, dotted, wavy
      switch (value) {
        case 'underline':
          o.decoration = 'underline';
          break;
        case 'line-through':
          o.decoration = 'lineThrough';
          break;
        case 'overline':
          o.decoration = 'overline';
          break;
      }
      break;
    case 'text-decoration-color':
      o.decorationColor = value;
      break;
    case 'text-decoration-style':
      o.decorationStyle = value;
      break;
    case 'font-style':
      switch (value) {
        case 'italic':
          o.italics = true;
          break;
      }
      break;
    case 'font-family':
      o.font = value;
      break;
    case 'background-color':
      if (o.table) {
        o.layout = o.layout || {};
        o.layout.fillColor = () => value;
      } else {
        o.fillColor = value;
      }
      break;
    case 'margin':
      o.margin = expandProperty(value);
      break;
    case 'margin-top':
      o.margin = o.margin || [0, 0, 0, 0];
      o.margin[1] = toIntOrStr(value);
      break;
    case 'margin-bottom':
      o.margin = o.margin || [0, 0, 0, 0];
      o.margin[3] = toIntOrStr(value);
      break;
    case 'page-break-before':
      if (value === 'always') {
        o.pageBreak = 'before';
      }
      break;
    case 'page-break-after':
      if (value === 'always') {
        o.pageBreak = 'after';
      }
      break;
    case 'position':
      if (value === 'absolute') {
        o.absolutePosition = {};
      } else if (value === 'relative') {
        o.relativePosition = {};
      }
      break;
    case 'left':
    case 'top':
      if (!o.absolutePosition && !o.relativePosition) {
        console.error(directive + ' is set, but no absolute/relative position.');
        break;
      }
      const pos = o.absolutePosition ? 'absolutePosition' : 'relativePosition';

      if (directive === 'left') o[pos].x = toIntOrStr(value);
      else if (directive === 'top') o[pos].y = toIntOrStr(value);

      break;
    default:
      o[directive] = value;
  }
};

/**
 *
 * @param el DOM Element
 * @param o
 * @param styles additional styles
 */
const applyInnerStyles = (el, o) => {
  if (!el.getAttribute) {
    return;
  }

  const innerStyle = el.getAttribute('style') || '';

  innerStyle.split(';').forEach(style => {
    const st = style.trim().toLowerCase().split(':');
    if (st.length === 2) {
      computeStyleProperty(o, st[0], st[1]);
    }
  });

  computeAttr(el, o);
};

const computeAttr = (element, o) => {
  if (!o || !element || !element.getAttribute) return;

  const cssClass = element.getAttribute('class') || '';
  const styles = cssClass.length > 0 ? cssClass.split(' ').map(str => str.replace(/^/, '.')) : [];

  o.style = [element.parentNode.nodeName.toLowerCase(), element.nodeName.toLowerCase()].concat(styles);

  for (let i = 0; i < element.attributes.length; i++) {
    let attr = element.attributes[i];
    if (element.nodeName === 'IMG' && (attr.name === 'src' || attr.name === ':src')) continue;
    if (attr.name === 'class') continue;
    if (attr.name === 'style') continue;


    if (attr.name === 'widths') continue;
    if (attr.name === 'heights') continue;

    const value = attr.value.split(' ');

    o[attr.name] = value.length > 1 ?
      value.map(v => toIntOrStr(v)) :
      toIntOrStr(value[0]);
  }
};

exports.computeAttr = computeAttr;
exports.applyInnerStyles = applyInnerStyles;
exports.computeStyleProperty = computeStyleProperty;
