export const htmlToDom = (html: string): Element | null => {
  if (typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body;
  } else if (typeof document !== 'undefined' && typeof document.createDocumentFragment === 'function') {
    const fragment = document.createDocumentFragment();
    const doc = document.createElement('div');
    doc.innerHTML = html;
    fragment.append(doc);

    return fragment.children[0];
  }

  throw new Error('Could not parse html to DOM. Please use external parser like jsdom.');
};