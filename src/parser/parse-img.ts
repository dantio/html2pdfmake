import {META} from '../constants.js';
import {Context} from '../context.js';
import {Item} from '../types/item.types.js';

export function isBase64(str: string): boolean {
  return /^data:image\/(jpeg|png|jpg);base64,/.test(str);
}

export const parseImg = (el: Element, ctx: Context): Item | null => {
  const src = el.getAttribute('src');
  if (!src) {
    return null;
  }
  const name = el.getAttribute('name') || src;

  let image: string;
  if (isBase64(src)) {
    image = src;
  } else if (ctx.images[name]) {
    image = name;
  } else {
    ctx.images[src] = name;
    image = name;
  }

  return {
    image,
    [META]: {}
  };
};