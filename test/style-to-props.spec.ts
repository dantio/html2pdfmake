import {parse} from '../src/index.js';
import {expect} from 'chai';
import {JSDOM} from 'jsdom';

function html(tmp: string) {
  const dom = new JSDOM('<!DOCTYPE html><body>' + tmp + '</body>');
  return dom.window.document.body;
}

describe('Style to props', () => {
  describe('attributes', () => {
    it('use lowercase attribute name', () => {
      const template = `<span style="COLOR: black">Text</span>`;
      const dom = html(template);
      const {content}: any = parse(dom);
      expect(content[0].text[0].text[0].text[0].text).to.equal('Text');
      expect(content[0].text[0].color).to.equal('black');
    });
  });

  describe('font-family', () => {
    it('selects first font family', () => {
      const template = `<span style="font-family: 'Roboto', sans-serif">Text</span>`;
      const dom = html(template);
      const {content}: any = parse(dom);
      expect(content[0].text[0].text[0].text[0].text).to.equal('Text');
      expect(content[0].text[0].font).to.equal('Roboto');
    });
  });

});
