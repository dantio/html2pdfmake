import {parse} from '../src/index.js';
import {expect} from 'chai';
import {JSDOM} from 'jsdom';

function html(tmp: string) {
  const dom = new JSDOM('<!DOCTYPE html><body>' + tmp + '</body>');
  return dom.window.document.body;
}

describe('Parser', () => {
  describe('Text', () => {
    describe('handles whitespace', () => {
      it('removes whitespaces', () => {
        const template = '<span>Text  </span><span> Text</span>';
        const dom = html(template);
        const {content}: any = parse(dom);

        expect(content[0].text[0].text).to.equal('Text');
        expect(content[1].text[0].text).to.equal(' ');
        expect(content[1].text[1].text).to.equal('Text');
      });

      it('adds whitespaces', () => {
        const template = `<span>Text</span>  <span> Text</span>`;
        const dom = html(template);
        const {content}: any = parse(dom);

        expect(content[0].text[0].text).to.equal('Text');
        expect(content[1].text).to.equal('');
        expect(content[2].text[0].text).to.equal(' ');
        expect(content[2].text[1].text).to.equal('Text');
      });
    });

    it('#text', () => {
      const template = 'Test';
      const dom = html(template);

      const {content}: any = parse(dom);

      expect(content.length).to.equal(1);
      expect(content[0].text).to.equal('Test');
    });

    it('<span>#text</span>', () => {
      const template = '<span>Text</span>';
      const dom = html(template);
      const {content}: any = parse(dom);

      expect(content[0].text[0].text).to.equal('Text');
      expect(content[0].style[0]).to.equal('span');
    });


    it('<p>#text</p>', () => {
      const template = '<p>Text</p>';
      const dom = html(template);
      const parser = parse(dom);
      let content: any = parser.content;
      expect(content[0].stack[0].text[0].text).to.equal('Text');
    });

    it('<p><span/></p>', () => {
      const template = '<p><span>Text</span></p>';
      const dom = html(template);
      const {content}: any = parse(dom);
      expect(content[0].stack[0].text[0].text[0].text).to.equal('Text');
    });

    it('<p><span/>#text</p>', () => {
      const template = '<p><span>Text</span>#text</p>';
      const dom = html(template);
      const {content}: any = parse(dom);
      expect(content[0].stack[0].text[0].text[0].text).to.equal('Text');
      expect(content[0].stack[0].text[1].text).to.equal('#text');
    });

    it('<p><span/><b/></p>', () => {
      const template = '<p><span>Text</span><b>b</b></p>';
      const dom = html(template);
      const {content}: any = parse(dom);
      expect(content[0].stack[0].text[0].text[0].text).to.equal('Text');
      expect(content[0].stack[0].text[1].text[0].text).to.equal('b');
      expect(content[0].style[0]).to.equal('p');
    });

    it('<div><p/><span/><b/></div>', () => {
      const template = '<div><p>Text1</p><span>Text2</span><b>b</b></div>';
      const dom = html(template);
      const parser = parse(dom);
      let content: any = parser.content;
      //                div      p
      expect(content[0].stack[0].stack[0].text[0].text).to.equal('Text1');
      expect(content[0].stack[1].text[0].text[0].text).to.equal('Text2');
      expect(content[0].stack[1].text[1].text[0].text).to.equal('b');
    });
  });

  xdescribe('Table', () => {
    it('table tbody tr td #text ', () => {
      const template = '<table><tr><td>Test</td><td>Test2</td></tr></table>';

      let parser = parse(html(template));
      let dd: any = parser.content;
      expect(dd[0].table.body[0][0].stack[0].text).to.equal('Test');
      expect(dd[0].table.body[0][1].stack[0].text).to.equal('Test2');
    });


    it('table tbody tr td #text', () => {
      const template = '<table><tbody><tr><td>Test</td></tr></tbody></table>';
      let parser = parse(html(template));
      let dd: any = parser.content;
      expect(dd[0].table.body[0][0].stack[0].text).to.equal('Test');
    });

    it('table tbody tr td p #text', () => {
      const template = '<table><tr><td><p>Test</p></td></tr></table>';
      let parser = parse(html(template));
      let dd: any = parser.content;
      expect(dd[0].table.body[0][0].stack[0].text[0].text).to.equal('Test');
    });
  });

  xdescribe('Ul', () => {
    it('ul li p #text', () => {
      const template = '<ul><li><p>Test</p></li></ul>';
      let parser = parse(html(template));
      let dd: any = parser.content;
      expect(dd[0].ul[0][0].stack[0].text[0].text).to.equal('Test');
    });
  });

  describe('P', () => {
    it('<p><b/><strong/></p>', () => {
      const template = '<p><b>bold</b><strong>strong</strong></p>';

      const {content}: any = parse(html(template));
      const p = content[0].stack[0];
      expect(p.text[0].text[0].text).to.equal('bold');
      expect(p.text[0].text[0].bold).to.equal(true);

      expect(p.text[1].text[0].text).to.equal('strong');
      expect(p.text[1].text[0].bold).to.equal(true);
    });

    it('<p><u/><i/></p>', () => {
      const template = '<p><u>underline</u><i>italics</i></p>';

      const {content}: any = parse(html(template));
      const p = content[0].stack[0];
      expect(p.text[0].text[0].text).to.equal('underline');
      expect(p.text[0].text[0].decoration).to.equal('underline');

      expect(p.text[1].text[0].text).to.equal('italics');
      expect(p.text[1].italics).to.equal(true);
    });
  });

  xdescribe('Div', () => {
    it('div p u #text', () => {
      const template = '<div><p><u>Test</u></p></div>';
      let parser = parse(html(template));

      let dd: any = parser.content;
      expect(dd[0].stack[0].text[0].text[0].text).to.equal('Test');
      expect(dd[0].stack[0].text[0].decoration).to.equal('underline');
    });

    it('div b/strong #text', () => {
      const template = '<div><b>Test</b><strong>Test</strong></div>';

      let parser = parse(html(template));
      let dd: any = parser.content;

      expect(dd[0].text[0].text).to.equal('Test');
      expect(dd[0].text[0].bold).to.equal(true);

      expect(dd[0].text[1].text).to.equal('Test');
      expect(dd[0].text[1].bold).to.equal(true);
    });

    it('div.row p u #text', () => {
      const template = '<div class="row"><p><u>Column 1</u></p><p><i>Column 2</i></p></div>';
      let parser = parse(html(template));
      let dd: any = parser.content;

      expect(dd[0].columns.length).to.equal(2);
      expect(dd[0].columns[0].text[0].text).to.equal('Column 1');
      expect(dd[0].columns[1].text[0].text).to.equal('Column 2');
    });
  });

  xdescribe('Img', () => {
    it('img', () => {
      const template = '<div class="row"><img src="test.jpg" /><img src="test2.jpg" /></div>';
      let parser = parse(html(template));
      let dd: any = parser.content;
      expect(dd[0].columns.length).to.equal(2);
      expect(dd[0].columns[0].image).to.equal('test.jpg');
      expect(dd[0].columns[1].image).to.equal('test2.jpg');
    });

    it('img', () => {
      const template = '<div class="row"><img src="test.jpg" name="image"/><img src="test2.jpg" /></div>';
      let parser = parse(html(template));
      let dd: any = parser.content;
      expect(dd[0].columns.length).to.equal(2);
      expect(dd[0].columns[0].image).to.equal('image');
      expect(dd[0].columns[1].image).to.equal('test2.jpg');
    });
  });

});
