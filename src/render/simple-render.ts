import {El} from '../types.js';

export const simpleRender = (el: El, data: Record<string, unknown>) => {
  const clone = el.cloneNode(true) as Element;

  Object.keys(data).forEach(key => {
    const value = data[key];

    clone.querySelectorAll('[data-value="' + key + '"]').forEach(el => {
      el.innerHTML = '' + value;
    });
  });

  return clone;
};