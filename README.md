# html2pdfmake
Parse HTML/DOM to pdfmake.

## Install
```bash 
npm i html2pdfmake
yarn add html2pdfmake
```

## Usage
```js
import {parse} from 'html2pdfmake';
const {content, images, patterns} = parse(document.getElementById('template'));

pdfMake.createPdf({
  // everything else
  content,
  images,
  patterns
})

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