export const toUnit = (value: string | number, rootPt = 12): number => {
  // if it's just a number, then return it
  if (typeof value === 'number') {
    return isFinite(value) ? value : 0;
  }

  const val = Number(parseFloat(value));
  if (isNaN(val)) {
    return 0;
  }

  const match = ('' + value).trim().match(/(pt|px|r?em|cm)$/);
  if (!match) {
    return val;
  }

  switch (match[1]) {
    case 'em':
    case 'rem':
      return val * rootPt;
    case 'px':
      // 1px = 0.75 Point
      return Number((val * 0.75).toFixed(2));
    case 'cm':
      return Number((val * 28.34).toFixed(2));
    case 'mm':
      return Number((val * 10 * 28.34).toFixed(2));
    default:
      return val;
  }
};

export const getUnitOrValue = (value: string | number): number | string =>
  typeof value === 'string' && (value.indexOf('%') > -1 || value.indexOf('auto') > -1)
    ? value
    : toUnit(value);

export const toUnitOrValue = (value: number | string): number | string | null => getUnitOrValue(value);

export const toUnitsOrValues = (value: Array<number | string>): Array<number | string> => value.map(v => getUnitOrValue(v));

export const expandValueToUnits = (value: string): [number | string, number | string, number | string, number | string] | null => {
  const values = toUnitsOrValues(value.split(' ')
    .map(v => v.trim())
    .filter(v => v));

  if (values === null || !Array.isArray(values)) {
    return null;
  }

  // values[0] = top
  // values[1] = right
  // values[2] = bottom
  // values[3] = left

  // pdfmake use left, top, right, bottom, ||  [horizontal, vertical]
  // css use top, right, bottom, left
  if (values.length === 1 && values[0] !== null) {
    return [values[0], values[0], values[0], values[0]];
  } else if (values.length === 2) {
    // topbottom leftright
    return [values[1], values[0], values[1], values[0]];
  } else if (values.length === 3) {
    // top bottom leftright
    return [values[2], values[0], values[2], values[1]];
  } else if (values.length === 4) {
    return [values[3], values[0], values[1], values[2]];
  }

  return null;
};