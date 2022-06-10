import {parse} from '../src/index.js';
import {expect} from 'chai';
import {JSDOM} from 'jsdom';

function html(tmp: string) {
  const dom = new JSDOM('<!DOCTYPE html><html lang="en">' + tmp + '</html>');
  return dom.window.document;
}

describe('Parse Template', () => {
  it('parse template', () => {
    const template = `
    <head>
      <title>Title</title>
      <meta name="author" content="Author">
      <meta name="page-orientation" content="landscape">
      <meta name="page-size" content="A5">
      <meta name="page-margins" content="50, 100, 100, 50">
    </head>
    <body>
    <header>
      <span>Header</span>
    </header>
    <main></main>
    <footer>
      <span>Footer</span>
    </footer>
    </body>`;
    const dom = html(template);
    const {info, pageOrientation, pageMargins, header, footer} = parse(dom);
    expect(info.title).to.equal('Title');
    expect(info.author).to.equal('Author');
    expect(pageOrientation).to.equal('landscape');
    expect(pageMargins).to.eql([50, 100, 100, 50]);
    const head: any = header(1, 1);
    const foot: any = footer(1, 1);
    expect(head[0].text[0].text[0].text[0].text).to.equal('Header');
    expect(foot[0].text[0].text[0].text[0].text).to.equal('Footer');
  });

});
