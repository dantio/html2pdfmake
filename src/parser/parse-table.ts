import {HANDLER, ITEMS, META} from '../constants.js';
import {handleTable} from '../handler/index.js';
import {LazyTable, TableDefinition} from '../types.js';
import {getChildItems} from '../utils/index.js';
import {isColgroup} from '../utils/type-guards.js';

export const parseTable = (): LazyTable | null => {
  // TODO table in table?
  return {
    table: {
      body: (items) => {
        // tbody -> tr
        const colgroup = items.find(isColgroup)?.stack[0] || [];
        const tbody = items.filter(item => !isColgroup(item));
        const trs = tbody.flatMap((item) => 'stack' in item ? item.stack : []);
        const body = trs.map((item) => getChildItems(item));

        if (body.length === 0) {
          return [];
        }

        const longestRow = body.reduce((a, b) => a.length <= b.length ? b : a);

        const table: TableDefinition = {
          body,
          widths: new Array(longestRow.length).fill('auto'),
          heights: new Array(trs.length).fill('auto')
        };

        return [[{
          table,
          layout: {
            defaultBorder: false
          },
          [META]: {
            [ITEMS]: {
              colgroup: 'text' in colgroup && Array.isArray(colgroup.text) ? colgroup.text: [],
              trs
            },
          }
        }]];
      },
      // widths: ['*'],
    },
    [META]: {
      [HANDLER]: handleTable,
    },
    layout: {}
  };
};