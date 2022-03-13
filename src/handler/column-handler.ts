import {IS_WHITESPACE, META, STYLE} from '../constants.js';
import {Item, ItemNode} from '../types.js';
import {getChildItems} from '../utils/index.js';
import {toUnitOrValue} from '../utils/unit.js';

export const handleColumns = (item: Item & { stack?: Item[] }) => {
  const childItems = getChildItems(item);
  const columns = {
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
      })
  };

  Object.assign(item, columns);
  delete item.stack;
};
