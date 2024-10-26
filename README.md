# yaclib-barebones
YACLib (Yet Another Component Library) web component prototypes in pure ES6 modules.
To be rewritten in TypeScript later.

To use on your page, put a `<script type="importmap"> ... </script>` tag with contents of the file `index.importmap` inside `<head>` tag.

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
<yac-qrcode
  url='https://developer.mozilla.org/en-US/docs/Web/HTML' <!-- current page url used if omitted -->
  correction='M' <!-- error correction level, M used if omitted -->
  margin='1' <!-- relative margin size (empty space around qr code), 1 used if omitted -->
  cellsize='1' <!-- relative cell size (black and white dots in qr code), 1 used if omitted -->
>
</yac-qrcode>
```

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
