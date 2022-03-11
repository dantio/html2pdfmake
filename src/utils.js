const rotate = (cx, cy, x, y, angle) => {
  if (angle === 0) {
    return {x, y};
  }

  const radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

  return {x: nx, y: ny};
};

const getCentroidOfPoints = (points) => {
  const length = points.length;
  const centroid = points.reduce((a, b) => ({x: a.x + b.x, y: a.y + b.y}), {x: 0, y: 0});
  return {
    x: centroid.x / length,
    y: centroid.y / length
  };
};

// 1px = 0.75 Point = number * 0.24
const toPoint = (value) => {
  let number = parseFloat(value);
  return parseInt(number, 10);
};

const toIntOrStr = (value) => {
  if (value === null) {
    return null;
  }

  function getIntOrString(v) {
    if (typeof v === 'string'
      && (v.indexOf('%') > -1 || v.indexOf('auto') > -1)) {
      return v;
    }
    return toPoint(v);
  }

  if (typeof value === 'string') {
    return getIntOrString(value);
  } else if (Array.isArray(value)) {
    return value.map(v => getIntOrString(v));
  }

  console.error('Only string and array are supported.');
  return null;
};

const expandProperty = (value) => {
  const values = value.split(' ');
  // values[0] = top
  // values[1] = right
  // values[2] = bottom
  // values[3] = left

  // pdfmake use left, top, right, bottom, ||  [horizontal, vertical]
  // css use top, right, bottom, left
  let result;
  if (values.length === 1) {
    result = [value, value, value, value];
  } else if (values.length === 2) {
    // topbottom leftright
    result = [values[1], values[0], values[1], values[0]];
  } else if (values.length === 3) {
    // top bottom leftright
    result = [values[2], values[0], values[2], values[1]];
  } else {
    result = [values[3], values[0], values[1], values[2]]
  }

  return toIntOrStr(result);
};

exports.rotate = rotate;
exports.getCentroidOfPoints = getCentroidOfPoints;
exports.expandProperty = expandProperty;
exports.toIntOrStr = toIntOrStr;
exports.toPoint = toPoint;
