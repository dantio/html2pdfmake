import {TableLayout} from 'pdfmake/interfaces.js';
import {BORDER, META, NODE, PADDING, POS_BOTTOM, POS_LEFT, POS_RIGHT, POS_TOP, STYLE} from '../constants.js';
import {Item, Table} from '../types/item.types.js';
import {Points} from '../types/props.types.js';
import {isTable} from '../utils/type-guards.js';

const computeMaxValue = (topBottom: Array<[number, number]>, leftRight: Array<[number, number]>, trIndex: number, tdIndex: number, points?: Points) => {
  topBottom[trIndex] = topBottom[trIndex] || [0, 0];
  leftRight[tdIndex] = leftRight[tdIndex] || [0, 0];

  topBottom[trIndex] = [
    Math.max(topBottom[trIndex][0], points?.[POS_TOP] || 0),
    Math.max(topBottom[trIndex][1], points?.[POS_BOTTOM] || 0)
  ];
  leftRight[tdIndex] = [
    Math.max(leftRight[tdIndex][0], points?.[POS_LEFT] || 0),
    Math.max(leftRight[tdIndex][1], points?.[POS_RIGHT] || 0)
  ];
};

export const handleTable = (item: Item) => {
  if (isTable(item)) {
    const bodyItem = item.table.body[0]?.[0];
    const tableItem: Table | null = bodyItem && typeof bodyItem !== 'string' && 'table' in bodyItem ? bodyItem : null;

    if (!tableItem) {
      return item;
    }

    const collapseBorder = item?.[META]?.[STYLE]?.['border-collapse'] === 'collapse';

    const innerTable = tableItem.table;

    type IndexTuple = Array<[number, number]>;

    const paddingsLeftRight: IndexTuple = [];
    const paddingsTopBottom: IndexTuple = [];
    const borderTopBottom: IndexTuple = [];
    const borderLeftRight: IndexTuple = [];

    innerTable.body
      .forEach((row, trIndex: number) => {
        row.forEach((column, tdIndex: number) => {
          if (column[META]?.[PADDING]) {
            computeMaxValue(paddingsTopBottom, paddingsLeftRight, trIndex, tdIndex, column[META]?.[PADDING]);
          }

          if (column[META]?.[BORDER]) {
            computeMaxValue(borderTopBottom, borderLeftRight, trIndex, tdIndex, column[META]?.[BORDER]);
          }

          if (typeof column !== 'string') {
            column.style = column.style || [];
            const nodeName = column[META]?.[NODE]?.nodeName === 'TH' ? 'th' : 'td';
            column.style.push(tdIndex % 2 === 0 ? nodeName + ':nth-child(even)' : nodeName + ':nth-child(odd)');
            column.style.push(trIndex % 2 === 0 ? 'tr:nth-child(even)' : 'tr:nth-child(odd)');
          }
        });
      });

    // Padding fix
    innerTable.body
      .forEach((row, trIndex: number) => {
        row.forEach((column, tdIndex: number) => {
          if (!column[META]?.[PADDING]?.[POS_LEFT] && typeof column !== 'string' && paddingsLeftRight[tdIndex]) {
            column.margin = column.margin || [0, 0, 0, 0];
            if (column.margin) {
              column.margin[POS_LEFT] = column.margin[POS_LEFT] - paddingsLeftRight[tdIndex][0];
            }
          }

          if (!column[META]?.[PADDING]?.[POS_TOP] && typeof column !== 'string' && paddingsTopBottom[trIndex]) {
            column.margin = column.margin || [0, 0, 0, 0];
            if (column.margin) {
              column.margin[POS_TOP] = column.margin[POS_TOP] - paddingsTopBottom[trIndex][0];
            }
          }
        });
      });


    const tableLayout: TableLayout = {
      defaultBorder: false
    };

    const defaultPadding = 0.75;

    if (paddingsTopBottom.length) {
      tableLayout.paddingTop = (i) => paddingsTopBottom[i]?.[0] ?? defaultPadding;
      tableLayout.paddingBottom = (i) => paddingsTopBottom[i]?.[1] ?? defaultPadding;
    }

    if (paddingsLeftRight.length) {
      tableLayout.paddingLeft = (i,) => paddingsLeftRight[i]?.[0] ?? defaultPadding;
      tableLayout.paddingRight = (i) => paddingsLeftRight[i]?.[1] ?? defaultPadding;
    }

    if (borderTopBottom.length) {
      tableLayout.hLineWidth = (i) => {
        const even = i % 2 === 0;
        if (collapseBorder) {
          return borderTopBottom[i]?.[0] ?? borderTopBottom[i - 1]?.[1] ?? 0;
        }

        if (i === 0) {
          return 0;
        }

        const index = even ? i - 1 : i;
        return borderTopBottom[index]?.[even ? 1 : 0] ?? 0;
      };
    }

    if (borderLeftRight.length) {
      tableLayout.vLineWidth = (i) => {
        const even = i % 2 === 0;

        if (collapseBorder) {
          return borderLeftRight[i]?.[0] ?? borderLeftRight[i - 1]?.[1] ?? 0;
        }

        if (i === 0) {
          return 0;
        }

        const index = even ? i - 1 : i;
        return borderLeftRight[index]?.[even ? 1 : 0] ?? 0;
      };
    }

    tableItem.layout = tableLayout;

    if (collapseBorder) {
      item.layout = {
        ...(typeof item.layout !== 'string' ? item.layout : {}),
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0
      };
    }
  }

  return item;
};
