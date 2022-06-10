// https://stackoverflow.com/a/3627747/5025024
const rgb2hex = (rgb: string) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)?.slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('') || '000'}`;

export const parseColor = (color: string) => {
  if (color[0] === '#') {
    return color;
  }

  if (color.startsWith('rgb')) {
    return rgb2hex(color);
  }

  return 'black';
};