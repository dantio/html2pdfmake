const {JSDOM} = require('jsdom');
const {dom2pdfmake} = require('../src');
const cssjs = require('./css.js');
const {expect} = require('chai');

function html(tmp) {
  const dom = new JSDOM('<!DOCTYPE html><head></head><body>' + tmp + '</body>');
  return dom.window.document.body;
}

describe('Parser', () => {
  describe('Text', () => {
    it('#text', () => {
      const template = 'Test';
      const dom = html(template);
      const parser = dom2pdfmake(dom);
      let content = parser.content;
      expect(content[0].text).to.equal('Test');
    });

    it('span(#text)', () => {
      const template = '<span>Text</span>';
      const dom = html(template);
      const parser = dom2pdfmake(dom);
      let content = parser.content;
      expect(content[0].text[0].text).to.equal('Text');
      expect(content[0].style[0]).to.equal('body');
      expect(content[0].style[1]).to.equal('span');
    });

    it('p(#text)', () => {
      const template = '<p>Text</p>';
      const dom = html(template);
      const parser = dom2pdfmake(dom);
      let content = parser.content;
      expect(content[0].stack[0].text[0].text).to.equal('Text');
    });

    it('p(span)', () => {
      const template = '<p><span>Text</span></p>';
      const dom = html(template);
      const parser = dom2pdfmake(dom);
      let content = parser.content;
      expect(content[0].stack[0].text[0].text[0].text).to.equal('Text');
    });

    it('p(span #text)', () => {
      const template = '<p><span>Text</span>#text</p>';
      const dom = html(template);
      const parser = dom2pdfmake(dom);
      let content = parser.content;
      expect(content[0].stack[0].text[0].text[0].text).to.equal('Text');
      expect(content[0].stack[0].text[1].text).to.equal('#text');
    });

    it('p(span b)', () => {
      const template = '<p><span>Text</span><b>b</b></p>';
      const dom = html(template);
      const parser = dom2pdfmake(dom);
      let content = parser.content;
      expect(content[0].stack[0].text[0].text[0].text).to.equal('Text');
      expect(content[0].stack[0].text[1].text[0].text).to.equal('b');
      expect(content[0].stack[0].text[1].style[1]).to.equal('p');
    });

    it('p(span) #text', () => {
      const template = '<div><p>Text1</p><span>Text2</span><b>b</b></div>';
      const dom = html(template);
      const parser = dom2pdfmake(dom);
      let content = parser.content;
      expect(content[0].stack[0].stack[0].stack[0].text[0].text).to.equal('Text1');
      expect(content[0].stack[0].stack[1].text[0].text[0].text).to.equal('Text2');
      expect(content[0].stack[0].stack[1].text[1].text[0].text).to.equal('b');
    });

  });

  xdescribe('Table', () => {
    it('table tbody tr td #text ', () => {
      const template = '<table><tr><td>Test</td><td>Test2</td></tr></table>';

      let parser = dom2pdfmake(html(template));
      let dd = parser.content;
      expect(dd[0].table.body[0][0].stack[0].text).to.equal('Test');
      expect(dd[0].table.body[0][1].stack[0].text).to.equal('Test2');
    });


    it('table tbody tr td #text', () => {
      const template = '<table><tbody><tr><td>Test</td></tr></tbody></table>';
      let parser = dom2pdfmake(html(template));
      let dd = parser.content;
      expect(dd[0].table.body[0][0].stack[0].text).to.equal('Test');
    });

    it('table tbody tr td p #text', () => {
      const template = '<table><tr><td><p>Test</p></td></tr></table>';
      let parser = dom2pdfmake(html(template));
      let dd = parser.content;
      expect(dd[0].table.body[0][0].stack[0].text[0].text).to.equal('Test');
    });
  });

  describe('Ul', () => {
    it('ul li p #text', () => {
      const template = '<ul><li><p>Test</p></li></ul>';
      let parser = dom2pdfmake(html(template));
      let dd = parser.content;
      expect(dd[0].ul[0][0].stack[0].text[0].text).to.equal('Test');
    });
  });

  xdescribe('P', () => {
    it('p b/strong #text', () => {
      const template = '<p><b>Test</b><strong>Test</strong></p>';

      let parser = dom2pdfmake(html(template));
      let dd = parser.content;
      expect(dd[0].stack[0].text[0].text[0].text).to.equal('Test');
      expect(dd[0].stack[0].text[0].text[0].bold).to.equal(true);

      expect(dd[0].text[0].text[1].text).to.equal('Test');
      expect(dd[0].text[0].text[1].bold).to.equal(true);
    });

    xit('p u/i #text', () => {
      const template = '<p><u>Test</u><i>Test</i></p>';

      let parser = dom2pdfmake(html(template));
      let dd = parser.content;
      expect(dd[0].text[0].text).to.equal('Test');
      expect(dd[0].text[0].decoration).to.equal('underline');

      expect(dd[0].text[1].text).to.equal('Test');
      expect(dd[0].text[1].italics).to.equal(true);
    });
  });

  xdescribe('Div', () => {
    it('div p u #text', () => {
      const template = '<div><p><u>Test</u></p></div>';
      let parser = dom2pdfmake(html(template));

      let dd = parser.content;
      expect(dd[0].stack[0].text[0].text[0].text).to.equal('Test');
      expect(dd[0].stack[0].text[0].decoration).to.equal('underline');
    });

    it('div b/strong #text', () => {
      const template = '<div><b>Test</b><strong>Test</strong></div>';

      let parser = dom2pdfmake(html(template));
      let dd = parser.content;
      console.log(dd[0])
      expect(dd[0].text[0].text).to.equal('Test');
      expect(dd[0].text[0].bold).to.equal(true);

      expect(dd[0].text[1].text).to.equal('Test');
      expect(dd[0].text[1].bold).to.equal(true);
    });

    it('div.row p u #text', () => {
      const template = '<div class="row"><p><u>Column 1</u></p><p><i>Column 2</i></p></div>';
      let parser = dom2pdfmake(html(template));
      let dd = parser.content;

      expect(dd[0].columns.length).to.equal(2);
      expect(dd[0].columns[0].text[0].text).to.equal('Column 1');
      expect(dd[0].columns[1].text[0].text).to.equal('Column 2');
    });
  });

  describe('Img', () => {
    it('img', () => {
      const template = '<div class="row"><img src="test.jpg" /><img src="test2.jpg" /></div>';
      let parser = dom2pdfmake(html(template));
      let dd = parser.content;
      expect(dd[0].columns.length).to.equal(2);
      expect(dd[0].columns[0].image).to.equal('test.jpg');
      expect(dd[0].columns[1].image).to.equal('test2.jpg');
    });

    it('img', () => {
      const template = '<div class="row"><img src="test.jpg" name="image"/><img src="test2.jpg" /></div>';
      let parser = dom2pdfmake(html(template));
      let dd = parser.content;
      expect(dd[0].columns.length).to.equal(2);
      expect(dd[0].columns[0].image).to.equal('image');
      expect(dd[0].columns[1].image).to.equal('test2.jpg');
    });
  });

  describe('Style', () => {
    it('style', () => {
      var cssString = ' h2 { margin:40px 10px; padding:5px}';
      var parser = new cssjs();

      var parsed = parser.parseCSS(cssString);
      var cssObj = {};
      for (let i = 0; i < parsed.length; i++) {
        //console.log(parsed[i]);
        var selector = parsed[i].selector;
        cssObj[selector] = {};

        for (let r = 0; r < parsed[i].rules.length; r++) {
          let d = parsed[i].rules[r].directive;
          cssObj[selector][d] = parsed[i].rules[r].value;
        }
      }
      // expect(dd[0].columns.length).to.equal(2);
      //expect(dd[0].columns[0].image).to.equal('test.jpg');
      //expect(dd[0].columns[1].image).to.equal('test2.jpg');
    });
  });
});
