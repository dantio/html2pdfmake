import {Item} from '../types/item.types.js';
import {LazyItem} from '../types/lazy-item.types.js';
import {getChildItems} from '../utils/index.js';

const setLink = (href: string, link: Item) => {
  if (typeof link !== 'string') {
    if (href[0] === '#') {
      link.linkToDestination = href.slice(1);
    } else {
      link.link = href;
    }
  }
};

export const linkify = (href: string, item: Item) => {
  const children = getChildItems(item);

  children.forEach((link) => {
      setLink(href, link);
      linkify(href, link);
    });
};

export const parseLink = (href: string): LazyItem => {
  return {
    text: items => {
      items.forEach((link) => {
        setLink(href, link);
        linkify(href, link);
      });

      return items;
    }
  };
};