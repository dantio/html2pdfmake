import {IS_WHITESPACE, META, STYLE} from '../constants.js';
import {Column, Item, ItemNode} from '../types/item.types.js';
import {MetaNode} from '../types/meta.types.js';
import {getChildItems} from '../utils/index.js';
import {toUnitOrValue} from '../utils/unit.js';

export const handleColumns = (item: MetaNode<Item>): MetaNode<Column> => {
  const childItems = getChildItems(item);
  const spaceBetween = item[META][STYLE]?.['justify-content'] === 'space-between';
  const defaultWidth = spaceBetween ? '*' : 'auto';
  return {
    columns: childItems
      .flatMap((subItem: Item): ItemNode[] | ItemNode => {
        if ('text' in subItem && Array.isArray(subItem.text)) {
          return subItem.text
            .filter(childItem => !childItem[META]?.[IS_WHITESPACE])
            .map(text => {
              const width = toUnitOrValue(text[META]?.[STYLE]?.width || defaultWidth) || defaultWidth;
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
          width: toUnitOrValue(subItem[META]?.[STYLE]?.width || defaultWidth) || defaultWidth
        };
      }),
    columnGap: 'columnGap' in item ? item.columnGap : 0,
    [META]: item[META]
  };
};
