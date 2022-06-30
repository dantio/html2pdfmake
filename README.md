# html2pdfmake
Advanced HTML to PDFMake DocDefinition parser.

Parse HTML/DOM to pdfmake.

## Install
```bash 
npm i html2pdfmake
yarn add html2pdfmake
```

## Quick Usage
```html
<div id="template">
    <p>Text</p>
</div>
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