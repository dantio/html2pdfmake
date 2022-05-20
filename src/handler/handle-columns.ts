import {IS_WHITESPACE, META, STYLE} from '../constants.js';
import {Column, Item, ItemNode} from '../types.js';
import {getChildItems} from '../utils/index.js';
import {toUnitOrValue} from '../utils/unit.js';

export const handleColumns = (item: Item): Column => {
  const childItems = getChildItems(item);
  return {
    columns: childItems
      .flatMap((subItem: Item): ItemNode[] | ItemNode => {
        if ('text' in subItem && Array.isArray(subItem.text)) {
          return subItem.text
            .filter(childItem => !childItem[META]?.[IS_WHITESPACE])
            .map(text => {
              const width = toUnitOrValue(text[META]?.[STYLE]?.width || 'auto') || 'auto';
              return (typeof text === 'string') ? {
                text,
                width
              } : {
                ...text,
                width
              };
            });
        }

        return {
          stack: ([] as Item[]).concat(subItem),
          width: toUnitOrValue(subItem[META]?.[STYLE]?.width || 'auto') || 'auto'
        };
      }),
    columnGap: 'columnGap' in item ? item.columnGap : 0
  };
};