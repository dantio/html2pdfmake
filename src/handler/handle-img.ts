import {Item} from '../types/item.types.js';
import {isImage} from '../utils/type-guards.js';

export const handleImg = (image: Item) => {
  if (isImage(image) && typeof image.width === 'number' && typeof image.height === 'number') {
    image.fit = [image.width, image.height];
  }

  return image;
};