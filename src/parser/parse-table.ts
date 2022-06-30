import {Size} from 'pdfmake/interfaces.js';
import {BORDER, META, PADDING, POST_HANDLER, STYLE} from '../constants.js';
import {handleTable} from '../handler/index.js';
import {Item, ItemNode, Text} from '../types/item.types.js';
import {LazyTable} from '../types/lazy-item.types.js';
import {MetaNode} from '../types/meta.types.js';
import {TableDefinition} from '../types/table.types.js';
import {getChildItems} from '../utils/index.js';
import {isColgroup} from '../utils/type-guards.js';
import {getUnitOrValue, toUnit} from '../utils/unit.js';

export const tableLayoutReset = (defaultBorder = false) => ({
  paddingLeft: () => 0,
  paddingRight: () => 0,
  paddingTop: () => 0,
  paddingBottom: () => 0,
  hLineWidth: () => 0,
  vLineWidth: () => 0,

  defaultBorder
});

const spaceColumn = (): Text => ({
  text: '',
  border: [false, false, false, false],
  [META]: {[BORDER]: [0, 0, 0, 0], [PADDING]: [0, 0, 0, 0]}
});

const computeHeights = (trs: Item[], defaultHeight = 'auto') => {
  const heights: Size[] = new Array(trs.length).fill(defaultHeight);
  if (Array.isArray(trs)) {
    trs.forEach((tr, i: number) => {
      if (tr[META]?.[STYLE]?.height) {
        heights[i] = getUnitOrValue(tr[META]?.[STYLE]?.height || defaultHeight);
      }
    });
  }

  return heights;
};

const applyColStylesAndComputeWidth = (longestRow: number, percentageWidth: boolean, rows: Item[][], colgroup?: Item) => {
  const widths: Size[] = new Array(longestRow).fill(percentageWidth ? '*' : 'auto');

  if (!(colgroup && 'text' in colgroup && Array.isArray(colgroup.text))) {
    return widths;
  }

  colgroup.text.forEach((col: Item, i: number) => {
    // TODO support other styles and refactor code
    if (typeof col !== 'string') {
      rows.forEach(row => {
        if (row[i] && typeof row[i] !== 'string') {
          const item = row[i] as ItemNode;

          if (!item.fillColor && col.fillColor) { // only if not set
            item.fillColor = col.fillColor;
          }
        }
      });
    }

    if (col[META]?.[STYLE]?.width) {
      widths[i] = getUnitOrValue(col[META]?.[STYLE]?.width || '*');
    }
  });

  return widths;
};

type ExtraColumn = {
  index: number
  rowSpan: number
}

/**
 * Add a spacer Column if rowspan is defined.
 * Checks the colSpan value
 * @param rows
 * @param longestRow
 */
function verifyColspanRowspan(rows: Item[][], longestRow: number) {
  let rowSpan: ExtraColumn[] = [];
  return rows.map(column => {
    rowSpan.forEach(span => {
      column.splice(span.index, 0, {
        ...spaceColumn(),
        rowSpan: span.rowSpan - 1
      });
    });

    rowSpan = [];

    let colIndex = 0;

    const columns = column.map((column, index) => {
      if (typeof column !== 'string') {
        if (column.rowSpan && column.rowSpan > 1) {
          rowSpan.push({
            index,
            rowSpan: column.rowSpan
          });
        }

        if (column.colSpan) {
          if (column.colSpan > 1 && column.colSpan > (longestRow - colIndex)) {
            column.colSpan = longestRow - colIndex;
          }

          colIndex += column.colSpan;
        } else {
          colIndex += 1;
        }
      }

      return column;
    });

    // Not enough columns ?
    if (longestRow > colIndex) {
      return [
        ...columns,
        ...new Array(longestRow - colIndex).fill(null).map(spaceColumn)
      ];
    }

    return columns;
  });
}

const withBorder = (td: Item): td is MetaNode<ItemNode> => typeof td !== 'string' && typeof td.border !== 'undefined';
const withoutBorder = (td: Item): td is MetaNode<ItemNode> => typeof td !== 'string' && !td.border;

export const parseTable = (): LazyTable | null => {
  return {
    table: {
      body: (items, _, item) => {
        // tbody -> tr
        const colgroup = items.find(isColgroup)?.stack[0];
        const tbody = items.filter(item => !isColgroup(item));
        const trs = tbody.flatMap((item) => 'stack' in item ? item.stack : []);

        const collapseBorder = item?.[META]?.[STYLE]?.['border-collapse'] === 'collapse';

        const rows = trs.map((tr) => {
          const tds = getChildItems(tr);

          // Inherit border from TR
          if (collapseBorder && withBorder(tr)) {
            tds.filter(withoutBorder).forEach(td => {
              td.border = tr.border;
              td.borderColor = tr.borderColor;
              td[META][BORDER] = tr[META][BORDER];
            });
          }

          return tds;
        });

        if (rows.length === 0) {
          return [];
        }

        const percentageWidth = String(item?.[META]?.[STYLE]?.['width']).indexOf('%') > -1;

        const longestRow = rows.reduce((a, b) => a.length <= b.length ? b : a).length;

        const tdWidths: Size[] = applyColStylesAndComputeWidth(longestRow, percentageWidth, rows, colgroup);
        const trHeights: Size[] = computeHeights(trs);

        const body = verifyColspanRowspan(rows, longestRow);

        let table: TableDefinition = {
          body,
          widths: tdWidths,
          heights: trHeights
        };

        if (!collapseBorder) {
          const spacing = toUnit(item?.[META]?.[STYLE]?.['border-spacing'] || 2);

          const countColumns = longestRow * 2 + 1; // Double and the last one
          const widths = [...tdWidths.flatMap((value) => [spacing, value]), spacing];
          const heights = [...trHeights.flatMap((value) => [spacing, value]), spacing];

          const fakeRow = () => new Array(countColumns).fill(null).map(spaceColumn);

          const incSpan = (column: Item) => {
            if (typeof column !== 'string' && column.colSpan) {
              column.colSpan += 2; // next gap and the last one
            }
            if (typeof column !== 'string' && column.rowSpan) {
              column.rowSpan += 2; // next gap and the last one
            }

            return column;
          };

          const bodyWithGap = [
            ...body.flatMap(row => [
              fakeRow(),
              [...row.flatMap(column => [spaceColumn(), incSpan(column)]), spaceColumn()]
            ]),
            fakeRow()
          ];

          table = {
            body: bodyWithGap,
            widths,
            heights
          };
        }

        const innerTable = {
          table,
          layout: tableLayoutReset(),
        };

        return [[innerTable]];
      },
    },

    layout: tableLayoutReset(true),

    [META]: {
      [POST_HANDLER]: handleTable,
    },
  };
};