# yaclib-barebones
YACLib (Yet Another Component Library) web component prototypes in pure ES6 modules.
To be rewritten in TypeScript later.

To use on your page, put a `<script type="importmap"> ... </script>` tag with contents of the file [importmap.json](https://raw.githubusercontent.com/rm-netsu/yaclib-barebones/refs/heads/main/importmap.json) inside `<head>` tag of your page.

_Below_ the importmap tag add `<script type="module" src=" ... "></script>` tags with the components you want to use.

That's all, you can use the selected components in your html.

Currently available components:
- [QR code](#qr-code)

---
## QR code
Import:
```html
<script type="module" src="https://rm-netsu.github.io/yaclib-barebones/qrcode.js"></script>
```

Usage:
```html
<!-- minimal, contains url of the page where placed -->
<yac-qrcode></yac-qrcode>

<yac-qrcode
	url='https://developer.mozilla.org/en-US/docs/Web/HTML'
	correction='H'
	margin='2'
	cellsize='1'
>
</yac-qrcode>
```
Attributes:
- url: current page url used if omitted
- correction: error correction level (L/M/Q/H), M used if omitted
- margin: relative margin size (empty space around qr code), 1 used if omitted
- cellsize: relative cell size (black and white dots in qr code), 1 used if omitted

Dot shape can be customized by providing a js function in `cellfn` attribute.

Function accepts 3 arguments:
- x coordinate of dot
- y coordinate of dot
- relative dot size

Function returns the dot as a rendered svg part.

Below is the sample function for rendering circle dots:
```js
(x, y, c) => `<circle
	r="${c/2}"
	cx="${x +c/2}"
	cy="${y +c/2}"
	fill="black"
	shape-rendering="crispEdges"
/>`
```
