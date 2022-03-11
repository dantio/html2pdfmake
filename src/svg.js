const {getCentroidOfPoints, rotate} = require('./utils');

const parseSVGElement = (e, scaleX, scaleY) => {
  const tag = e.nodeName.toLowerCase();
  // Ignore text and comment
  switch (tag) {
    case '#text':
    case '#comment':
      return null;
  }

  let translateX = 0,
    translateY = 0,
    angle = 0,
    rx = 0;
  let transform = e.getAttribute && e.getAttribute('transform');

  if (transform) {
    transform = transform.split(' ');
    for (let i = 0; i < transform.length; i++) {
      const transformation = transform[i].match(/(\w+)\(([-+]?[0-9]*\.?[0-9]+),?([-+]?[0-9]*\.?[0-9]+)?\)/);

      if (!transformation) continue;
      if (transformation[1] === 'translate') {
        translateX = parseFloat(transformation[2]);
        translateY = parseFloat(transformation[3]);
      }

      if (transformation[1] === 'scale') {
        scaleX *= transformation[2];
        scaleY *= transformation[3];
      }

      if (transformation[1] === 'rotate') {
        angle = transformation[2];
        rx = parseInt(transformation[3] || 0);
      }
    }
  }

  const strokeWidth = parseInt(e.getAttribute('stroke-width') || 0);
  const lineColor = e.getAttribute('stroke') || 'black';
  switch (tag) {
    case 'line':
      return {
        type: 'line',
        x1: parseFloat(e.getAttribute('x1')),
        y1: parseFloat(e.getAttribute('y1')),
        x2: parseFloat(e.getAttribute('x2')),
        y2: parseFloat(e.getAttribute('y2')),
        lineColor: lineColor,
        lineWidth: strokeWidth
      };
    case 'polyline':
      const polyline = {
        type: 'polyline',
        closePath: true,
        lineWidth: strokeWidth,
        lineColor: lineColor,
      };

      const color = e.getAttribute('fill');
      // 1. Scale
      const pointsMap = e.getAttribute('points').split(' ')
        .map(p => p.split(','))
        .map(p => ({x: parseFloat(p[0]) * scaleX, y: parseFloat(p[1]) * scaleY}));
      // 2. Rotate
      const center = getCentroidOfPoints(pointsMap);
      const points = pointsMap.map(p => {
        const {x, y} = rotate(center.x, center.y, parseFloat(p.x), parseFloat(p.y), angle);
        // 3. Translate
        return {
          x: parseFloat(x) + translateX,
          y: parseFloat(y) + translateY
        }
      });

      polyline.points = points;
      if (color) polyline.color = color;
      return polyline;
    default:
      console.log('#dom2pdfmake', 'Parsing SVG ' + e.nodeName + ' not found');
      throw new Error('SVG PARSING');
      break;
  }
};

const parseSVG = (e) => {
  const fullWidth = 100, // TODO
    fullHeight = 100, // TODO
    elements = [],
    children = e.childNodes,
    width = parseInt(e.getAttribute('width')) || fullWidth,
    height = parseInt(e.getAttribute('height')) || fullHeight,
    scaleX = width / fullWidth,
    scaleY = height / fullHeight;

  if (children.length !== 0) {
    for (let i = 0; i < children.length; i++) {
      const el = parseSVGElement(children[i], scaleX, scaleY);
      if (el !== null) {
        elements.push(el);
      }
    }
  }

  return elements;
};

exports.parseSVG = parseSVG;
