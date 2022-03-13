import {isImage} from '../utils/type-guards.js';
import {Item} from '../types.js';

export const handleImg = (image: Item) => {
  if (isImage(image) && typeof image.width === 'number' && typeof image.height === 'number') {
    image.fit = [image.width, image.height];
  }
};