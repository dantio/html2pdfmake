const {parseSVG} = require('./svg.js');
const {applyInnerStyles} = require('./style.js');

const blockRegex = /^(address|blockquote|body|center|dir|div|dl|fieldset|form|h[1-6]|hr|isindex|menu|noframes|noscript|ol|p|pre|table|ul|dd|dt|frameset|li|tbody|td|tfoot|th|thead|tr|html)$/i;

const isBlockLevel = el => blockRegex.test(el.nodeName);

const defaultStyles = {
  'h1': {
    fontSize: 32
  },
  'h2': {
    fontSize: 24
  },
  'h3': {
    fontSize: 18.72
  },
  'h4': {
    fontSize: 16
  },
  'h5': {
    fontSize: 13.28
  },
  'h6': {
    fontSize: 10.72
  },
  'b': {
    bold: true
  },
  'strong': {
    bold: true
  },
  'u': {
    decoration: 'underline'
  },
  'i': {
    italics: true
  },
  'th': {
    bold: true
  }
};

const parseRow = (e, s, i) => {
  const tag = e.nodeName.toLowerCase();
  const st = {
    _el: tag,
    stack: [parseTextElement(e, s, i)]
  };

  const rspan = e.getAttribute('rowspan');
  if (rspan) {
    st.rowSpan = parseInt(rspan, 10);
  }
  const cspan = e.getAttribute('colspan');
  if (cspan) {
    st.colSpan = parseInt(cspan, 10);
  }

  return st;
};

const parseTable = (e, s, i) => {
  const result = {
    table: {
      widths: [],
      heights: [], // Row height
      body: parseContainer(e, s, i)[0]
    },
    layout: {}
  };

  // TODO use cols?
  const widths = e.getAttribute('widths');
  if (!widths) {
    if (result.table.body && result.table.body.length !== 0) {
      if (result.table.body[0] && result.table.body[0].length !== 0) {
        for (let k = 0; k < result.table.body[0].length; k++) {
          result.table.widths.push('*');
        }
      }
    }
  } else {
    widths.split(/[\s,]+/).forEach(w => {
      if (isNaN(w)) {
        result.table.widths.push(w);
      } else {
        result.table.widths.push(parseInt(w));
      }
    });
  }
  const heights = e.getAttribute('heights');
  if (heights) {
    heights.split(/[\s,]+/).forEach(h => {
      if (isNaN(h)) {
        result.table.heights.push(h);
      } else {
        result.table.heights.push(parseInt(h));
      }
    });
  }

  return result;
};

const parseDiv = (e, s, i) => {
  // columns
  // TODO add flexbox support?
  let div;
  if (e.className.split(' ').indexOf('row') > -1) {
    div = {columns: parseContainer(e, s, i)}
  } else {
    div = {stack: [parseTextElement(e, s, i)]}
  }
  return div;
};

const parseList = (e) => {
  return {
    [e.nodeName.toLowerCase()]: parseContainer(e)
  };
};

function parseTextElement(el, styles, images) {
  const con = parseContainer(el, styles, images);

  if (con.length === 0) {
    return null;
  }

  const stack = [];

  con.forEach(ed => {
    // Append text to last element
    if (ed.text && ed.text.length) {
      applyInnerStyles(el, ed);
      const last = stack.length - 1;
      if (stack[last] && stack[last].text) {
        stack[last].text.push(ed);
      } else {
        stack.push({text: [ed]});
      }
    } else {
      stack.push(ed);
    }
  });

  if (isBlockLevel(el) || stack.length > 1) {
    return {stack};
  }

  return stack[0];
}

const parseImg = (e, styles, images) => {
  const src = e.getAttribute('src');
  if (!src) {
    return null;
  }
  const img = {};
  const name = e.getAttribute('name');
  if (name) {
    if (!images[name]) {
      images[name] = src;
    }

    img.image = name;
  } else {
    img.image = src;
  }

  const fit = e.getAttribute('data-fit');
  if (fit && fit === 'true') {
    const width = e.getAttribute('width');
    const height = e.getAttribute('height');

    if (width && height) {
      img.fit = [parseInt(width, 10), parseInt(height, 10)];
      e.removeAttribute('width');
      e.removeAttribute('height');
    }
  }

  return img;
};

const rules = {
  '#comment': () => null,
  '#text': (e) => {
    const text = e.textContent.replace(/\r\n/g, '');
    if (text.trim().length === 0) {
      return null;
    }

    return {text};
  },
  'span': parseTextElement,
  'br': () => ({stack: [{text: ' '}]}),
  'b': parseTextElement,
  'strong': parseTextElement,
  'u': parseTextElement,
  'i': parseTextElement,

  'table': parseTable,
  'tbody': parseContainer,
  'tr': parseContainer,
  'th': parseRow,
  'td': parseRow,

  'li': parseContainer,
  'div': parseDiv,

  'h1': parseTextElement,
  'h2': parseTextElement,
  'h3': parseTextElement,
  'h4': parseTextElement,
  'h5': parseTextElement,
  'h6': parseTextElement,
  'p': parseTextElement,

  'ul': parseList,
  'ol': parseList,

  'img': parseImg,
  'svg': (e) => ({
    canvas: parseSVG(e)
  })
};

function parseElement(el, styles, images) {
  if (!el) {
    return null;
  }

  const tag = el.nodeName.toLowerCase();
  const rule = rules[tag];
  if (!rule) {
    return null;
  }

  const ed = rule(el, styles, images);
  if (!ed) {
    return null;
  }

  applyInnerStyles(el, ed);

  return ed;
}

function parseContainer(container, styles, images) {
  const elements = [];
  const children = container.childNodes;
  if (children.length !== 0) {
    for (let i = 0; i < children.length; i++) {
      const el = parseElement(children[i], styles, images);
      if (el === null) {
        continue;
      }
      elements.push(el);
    }
  }

  return elements;
}

const dom2pdfmake = (dom, styles = defaultStyles, images = {}) => {
  const content = parseContainer(dom, styles, images);

  return {content, styles, images};
};

exports.dom2pdfmake = dom2pdfmake;