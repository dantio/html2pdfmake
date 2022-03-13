import {getUnitOrValue} from '../utils/unit.js';

export const parseSvg = (el: Element) => {
  // TODO is this okay?
  const svgEl = el.cloneNode(true) as Element;
  const width = el.getAttribute('width');
  const height = el.getAttribute('height');
  if (width) {
    svgEl.setAttribute('width', '' + getUnitOrValue(width));
  }
  if (height) {
    svgEl.setAttribute('height', '' + getUnitOrValue(height));
  }
  return {
    svg: svgEl.outerHTML.replace(/\n(\s+)?/g, ''),
  };
};