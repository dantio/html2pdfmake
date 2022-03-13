import {ITEMS, META, PADDING, POS_BOTTOM, POS_LEFT, POS_RIGHT, POS_TOP, STYLE} from '../constants.js';
import {Item, Table, TableLayout} from '../types.js';
import {isTable} from '../utils/type-guards.js';
import {getUnitOrValue} from '../utils/unit.js';

export const handleTable = (item: Item) => {
  if (isTable(item) && item[META]?.[ITEMS]) {
    const bodyItem = item.table.body[0]?.[0];
    const tableItem: Table | null = bodyItem && typeof bodyItem !== 'string' && 'table' in bodyItem ? bodyItem : null;
    if (!tableItem) {
      return;
    }

    const innerTable = tableItem.table;

    const colgroup = item[META]?.[ITEMS]?.colgroup;
    if (colgroup && 'stack' in colgroup) {
      innerTable.widths = innerTable.widths || [];
      colgroup.stack.forEach((col, i: number) => {
        if (col[META]?.[STYLE]?.width && innerTable.widths) {
          innerTable.widths[i] = getUnitOrValue(col[META]?.[STYLE]?.width || 'auto');
        }
      });
    }

    const trs = item[META]?.[ITEMS]?.trs;
    if (Array.isArray(trs)) {
      trs.forEach((tr, i: number) => {
        if (tr[META]?.[STYLE]?.height && innerTable.heights) {
          innerTable.heights[i] = getUnitOrValue(tr[META]?.[STYLE]?.height || 'auto');
        }
      });
    }

    const paddingsTopBottom: Record<number, [number, number]> = {};
    const paddingsLeftRight: Record<number, [number, number]> = {};

    innerTable.body
      .forEach((row, trIndex: number) => {
        row.forEach((column, tdIndex: number) => {
          if (typeof column !== 'string') {
            if (column[META]?.[PADDING]) {
              paddingsTopBottom[trIndex] = paddingsTopBottom[trIndex] || [0, 0];
              paddingsLeftRight[tdIndex] = paddingsLeftRight[tdIndex] || [0, 0];
              paddingsTopBottom[trIndex] = [
                Math.max(paddingsTopBottom[trIndex][0], column[META]?.[PADDING]?.[POS_TOP] || 0),
                Math.max(paddingsTopBottom[trIndex][1], column[META]?.[PADDING]?.[POS_BOTTOM] || 0)
              ];
              paddingsLeftRight[tdIndex] = [
                Math.max(paddingsLeftRight[tdIndex][0], column[META]?.[PADDING]?.[POS_LEFT] || 0),
                Math.max(paddingsLeftRight[tdIndex][1], column[META]?.[PADDING]?.[POS_RIGHT] || 0)
              ]
            }
            column.style = column.style || [];
            column.style.push(tdIndex % 2 === 0 ? 'td:nth-child(even)' : 'td:nth-child(odd)');
            column.style.push(trIndex % 2 === 0 ? 'tr:nth-child(even)' : 'tr:nth-child(odd)');
          }
        });
      });

    const tableLayout: TableLayout = {};
    const hasPaddingTopBottom = Object.keys(paddingsTopBottom).length > 0;
    const hasPaddingLeftRight = Object.keys(paddingsLeftRight).length > 0;

    if (hasPaddingTopBottom) {
      tableLayout.paddingTop = (i) => {
        if (paddingsTopBottom[i]) {
          return paddingsTopBottom[i][0];
        }

        return 0;
      };

      tableLayout.paddingBottom = (i) => {
        if (paddingsTopBottom[i]) {
          return paddingsTopBottom[i][1];
        }

        return 0;
      };
    }

    if (hasPaddingLeftRight) {
      tableLayout.paddingRight = (i) => {
        if (paddingsLeftRight[i]) {
          return paddingsLeftRight[i][1];
        }

        return 0;
      };
      tableLayout.paddingLeft = (i,) => {
        if (paddingsLeftRight[i]) {
          return paddingsLeftRight[i][0];
        }

        return 0;
      };
    }

    if (hasPaddingLeftRight || hasPaddingTopBottom) {
      tableItem.layout = tableLayout;
    }
  }
};
