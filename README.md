# html2pdfmake
Advanced HTML to PDFMake DocDefinition parser.

Parse HTML/DOM to pdfmake.

## Install
```bash 
npm i html2pdfmake
yarn add html2pdfmake
```

## Quick Usage
### Module
```html
<div id="template">
    <p>Text</p>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.3.0-beta.2/pdfmake.min.js"></script>
<script type="module">
import {parse} from 'https://cdn.jsdelivr.net/npm/html2pdfmake/dist/html2pdfmake.mjs';
const {content, images, patterns} = parse(document.getElementById('template'));

pdfMake.createPdf({
  // everything else
  content,
  images,
  patterns
})
</script>
```

### UMD
```html
<div id="template">
    <p>Text</p>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.3.0-beta.2/pdfmake.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/html2pdfmake/lib/html2pdfmake.min.js"></script>
<script>
const {content, images, patterns} = html2pdfmake.parse(document.getElementById('template'));
pdfMake.createPdf({
  // everything else
  content,
  images,
  patterns
})
</script>
```

## Config
Pass the config as the second parameter in `parse` function.
```ts
// parse('<div></div>', config);
export type Config = {
  globalStyles?: CssStyles, // custom global styles
  styles: CssStyles, // additional styles merged that overwrites globals styles
  nodeRule?: NodeRule // set the custom node rule. Return undefined if pre-defined rules should be applied.
  styleRule?: StyleRule // set the custom style rule. Return false if pre-defined rules should be applied.
  collapseMargin: true, // Enable/Disable margin collapse
  collapseWhitespace: true, // Enable/Disable witespace collapse
  render: (e, data) => e, // set render function for header/footer
  document: () => window.document, // set the global document object
  parseCss: (style: NodeListOf<HTMLStyleElement>) => {}, // define <style> parser
  defaultFont: 'Roboto', // set the default font
  fonts?: TFontDictionary // pass the fonts that you are using for pdfmake to filter unsupported fonts.
}
```

### nodeRule example
```js
const config = {
  nodeRule: (el) => {
    if (el.nodeName === '#text') {
      return {
        text: 'My Custom text'
      };
    }

    return undefined; // use pre-defined rules
  }
}
```

### styleRule example
```js
const config = {
  styleRule: (directive, value, props) => {
    if (directive === 'color') {
      props.color = 'red';
      return true; // 
    }

    return false;
  }
}
```


### NodeJS
Install a HTML parser like JSDOM. 

## Run examples
```sh
npm i http-server -g
npm i
npm run watch
# open new terminal
http-server .
# open localhost:8080
```