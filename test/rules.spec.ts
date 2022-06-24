import {expect} from 'chai';
import {JSDOM} from 'jsdom';
import {parse} from '../src/index.js';

function html(tmp: string) {
  const dom = new JSDOM('<!DOCTYPE html><body>' + tmp + '</body>');
  return dom.window.document.body;
}

describe('Rules', () => {
  describe('nodeRule', () => {
    it('return custom item', () => {
      const template = '<span>Text</span>';
      const dom = html(template);
      const {content}: any = parse(dom, {
        nodeRule: (el) => {
          if (el.nodeName === '#text') {
            return {
              text: 'Custom'
            };
          }

          return undefined;
        }
      });

      expect(content[0].text[0].text[0].text[0].text).to.equal('Custom');
      expect(content[0].text[0].style[0]).to.equal('span');
    });
  });

  describe('styleRule', () => {
    it('return custom item', () => {
      const template = '<span style="color: blue; font-size: 16px">Text</span>';
      const dom = html(template);
      const {content}: any = parse(dom, {
        styleRule: (directive, _, props) => {
          if (directive === 'color') {
            props.color = 'red';
            return true;
          }

          return false;
        }
      });

      expect(content[0].text[0].text[0].text[0].text).to.equal('Text');
      expect(content[0].text[0].text[0].text[0].color).to.equal('red');
      expect(content[0].text[0].text[0].text[0].fontSize).to.equal(12);
    });
  });
});