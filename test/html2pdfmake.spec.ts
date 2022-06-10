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
        const template = '<span>A  </span><span> B</span><span>C</span>';
        const dom = html(template);
        const {content}: any = parse(dom);
        // console.log(JSON.stringify(content, null, 2))
        //                wrapper.span   .inner
        expect(content[0].text[0].text[0].text[0].text).to.equal('A');
        expect(content[0].text[0].text[0].text[1].text).to.equal(' ');
        expect(content[0].text[1].text[0].text[0].text).to.equal('B');
      });

      it('adds whitespaces', () => {
        const template = `<span>Text</span>  <span> Text</span>`;
        const dom = html(template);
        const {content}: any = parse(dom);

        expect(content[0].text[0].text[0].text[0].text).to.equal('Text');
        expect(content[0].text[1].text[0].text).to.equal(' ');
        expect(content[0].text[2].text[0].text[0].text).to.equal('Text');
      });

    });

    it('#text', () => {
      const template = 'Test';
      const dom = html(template);

      const {content}: any = parse(dom);

      expect(content.length).to.equal(1);
      expect(content[0].text[0].text[0].text).to.equal('Test');
    });

    it('<span>#text</span>', () => {
      const template = '<span>Text</span>';
      const dom = html(template);
      const {content}: any = parse(dom);

      expect(content[0].text[0].text[0].text[0].text).to.equal('Text');
      expect(content[0].text[0].style[0]).to.equal('span');
    });


    it('<p>#text</p>', () => {
      const template = '<p>Text</p>';
      const dom = html(template);
      const {content}: any = parse(dom);

      expect(content[0].stack[0].text[0].text[0].text).to.equal('Text');
    });

    it('<p><span/></p>', () => {
      const template = '<p><span>Text</span></p>';
      const dom = html(template);
      const {content}: any = parse(dom);

      expect(content[0].stack[0].text[0].text[0].text[0].text).to.equal('Text');
    });

    it('<p><span/>#text</p>', () => {
      const template = '<p><span>Text</span>#text</p>';
      const dom = html(template);
      const {content}: any = parse(dom);

      expect(content[0].stack[0].text[0].text[0].text[0].text).to.equal('Text');
      expect(content[0].stack[0].text[1].text[0].text).to.equal('#text');
    });

    it('<p><span/><b/></p>', () => {
      const template = '<p><span>Text</span><b>b</b></p>';
      const dom = html(template);
      const {content}: any = parse(dom);

      expect(content[0].stack[0].text[0].text[0].text[0].text).to.equal('Text');
      expect(content[0].stack[0].text[1].text[0].text[0].text).to.equal('b');
      expect(content[0].stack[0].text[0].style[0]).to.equal('span');
      expect(content[0].style[0]).to.equal('p');
    });

    it('<div><p/><span/><b/></div>', () => {
      const template = '<div><p>Text1</p><span>Text2</span><b>b</b></div>';
      const dom = html(template);
      const {content}: any = parse(dom);
      //                div      p
      expect(content[0].stack[0].stack[0].text[0].text[0].text).to.equal('Text1');
      expect(content[0].stack[1].text[0].text[0].text[0].text).to.equal('Text2');
      expect(content[0].stack[1].text[1].text[0].text[0].text).to.equal('b');
    });
  });

  describe('Table', () => {
    it('<table><tr><td><td></tr></table>', () => {
      const template = '<table><tr><td>#text1</td><td>#text2</td></tr></table>';

      const {content}: any = parse(html(template));
      const outerTableContent = content[0].table.body[0][0];

      expect(outerTableContent.table.body[0][0].stack[0].text[0].text[0].text).to.equal('#text1');
      expect(outerTableContent.table.body[0][1].stack[0].text[0].text[0].text).to.equal('#text2');
    });


    it('<table><tbody><tr><td></tr></tbody></table>', () => {
      const template = '<table><tbody><tr><td>#text1</td></tr></tbody></table>';
      const {content}: any = parse(html(template));
      const outerTableContent = content[0].table.body[0][0];

      expect(outerTableContent.table.body[0][0].stack[0].text[0].text[0].text).to.equal('#text1');
    });

    it('<table><tr><td><p></td></tr></table>', () => {
      const template = '<table><tr><td><p>#text1</p></td></tr></table>';
      const {content}: any = parse(html(template));
      const outerTableContent = content[0].table.body[0][0];
      //                                        td       p       wrapper  text
      expect(outerTableContent.table.body[0][0].stack[0].stack[0].text[0].text[0].text).to.equal('#text1');
    });
  });

  describe('List', () => {
    it('<ul><li><p></li></ul>', () => {
      const template = '<ul><li><p>#text1</p></li></ul>';
      const {content}: any = parse(html(template));

      //                      li       p        w       text
      expect(content[0].ul[0].stack[0].stack[0].text[0].text[0].text).to.equal('#text1');
    });

    it('<ol><li><p></li></ol>', () => {
      const template = '<ol><li><p>#text1</p></li></ol>';
      const {content}: any = parse(html(template));

      //                      li       p        w       text
      expect(content[0].ol[0].stack[0].stack[0].text[0].text[0].text).to.equal('#text1');
    });
  });

  describe('Styles', () => {
    it('<p><b><strong></p>', () => {
      const template = '<p><b>bold</b><strong>strong</strong></p>';

      const {content}: any = parse(html(template));
      const p = content[0].stack[0];

      expect(p.text[0].text[0].text[0].text).to.equal('bold');
      expect(p.text[0].text[0].text[0].bold).to.equal(true);

      expect(p.text[1].text[0].text[0].text).to.equal('strong');
      expect(p.text[1].text[0].text[0].bold).to.equal(true);
    });

    it('<p><u><i></p>', () => {
      const template = '<p><u>underline</u><i>italics</i></p>';

      const {content}: any = parse(html(template));
      const p = content[0].stack[0];
      expect(p.text[0].text[0].text[0].text).to.equal('underline');
      expect(p.text[0].text[0].text[0].decoration).to.equal('underline');

      expect(p.text[1].text[0].text[0].text).to.equal('italics');
      expect(p.text[1].italics).to.equal(true);
    });

    it('<div><p><u></div>', () => {
      const template = '<div><p><u>Test</u></p></div>';
      const {content}: any = parse(html(template));

      expect(content[0].stack[0].stack[0].text[0].text[0].text[0].text).to.equal('Test');
      expect(content[0].stack[0].stack[0].text[0].decoration).to.equal('underline');
    });

    it('<div><b><strong></div>', () => {
      const template = '<div><b>#text1</b><strong>#text2</strong></div>';

      const {content}: any = parse(html(template));

      expect(content[0].stack[0].text[0].text[0].text[0].text).to.equal('#text1');
      expect(content[0].stack[0].text[0].bold).to.equal(true);

      expect(content[0].stack[0].text[1].text[0].text[0].text).to.equal('#text2');
      expect(content[0].stack[0].text[1].bold).to.equal(true);
    });
  });

  describe('Columns', () => {
    it('Columns: <div><p><u></p><p><i></p></div>', () => {
      const template = '<div style="display: flex"><p><u>Column 1</u></p><p><i>Column 2</i></p></div>';
      const {content}: any = parse(html(template));

      expect(content[0].columns.length).to.equal(2);
      //                           wrapper  p        wrapper u       text
      expect(content[0].columns[0].stack[0].stack[0].text[0].text[0].text[0].text).to.equal('Column 1');
      expect(content[0].columns[1].stack[0].stack[0].text[0].text[0].text[0].text).to.equal('Column 2');
    });

    it('Columns: <div><img><img></div>', () => {
      const template = '<div style="display: flex"><img src="test.jpg" name="image" /><img src="test2.jpg" /></div>';
      const {content}: any = parse(html(template));

      expect(content[0].columns.length).to.equal(2);
      expect(content[0].columns[0].stack[0].image).to.equal('image');
      expect(content[0].columns[1].stack[0].image).to.equal('test2.jpg');
    });
  });

  describe('<br>', () => {
    it('handle new lines', () => {
      const template = '<p>#text1<br><br><br>#text2</p>';
      const {content}: any = parse(html(template));

      expect(content[0].stack[0].text[0].text[0].text).to.equal('#text1');
      expect(content[0].stack[0].text[1].text[0].text).to.equal('\n');
      expect(content[0].stack[0].text[2].text[0].text).to.equal('\n');
      expect(content[0].stack[0].text[3].text[0].text).to.equal('\n');
      expect(content[0].stack[0].text[4].text[0].text).to.equal('#text2');
    });

  });

  describe('Link', () => {
    it('linkify', () => {
      const template = '<p><a href="#target">Link1<span>Inside</span></a><a href="example.com">Link2<span>Inside</span></a></p>';
      const {content}: any = parse(html(template));
      //                <p>      wrapper <a>     wrapper  text
      expect(content[0].stack[0].text[0].text[0].text[0].text[0].text).to.equal('Link1');
      expect(content[0].stack[0].text[1].text[0].text[0].text[0].text).to.equal('Link2');
      expect(content[0].stack[0].text[0].text[0].text[0].linkToDestination).to.equal('target');
      expect(content[0].stack[0].text[0].text[0].text[1].linkToDestination).to.equal('target');
      expect(content[0].stack[0].text[1].text[0].text[0].link).to.equal('example.com');
      expect(content[0].stack[0].text[1].text[0].text[1].link).to.equal('example.com');
    })
  })
});
