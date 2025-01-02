### Import:
```html
<script
	type="module"
	src="https://rm-netsu.github.io/yaclib-barebones/qrcode/index.js"
></script>
```

### Examples:
Minimal, contains URL of the page where it placed:
```html
<yac-qrcode></yac-qrcode>
```

Basic usage:
```html
<yac-qrcode
	data='https://developer.mozilla.org/en-US/docs/Web/HTML'
	correction='H'
	margin='2'
	icon
></yac-qrcode>
```

With custom background and overlay:
```html
<yac-qrcode
	data='https://developer.mozilla.org/en-US/docs/Web/HTML'
	margin='2'
>
	<div slot='background'> your custom background </div>
	<div slot='overlay'> your custom overlay </div>
</yac-qrcode>
```


### Attributes:
- **data**: text to encode in QR code. *Default: current page url*
- **correction**: error correction level. *Default: M*
- **margin**: margin of QR code in modules. *Default: 1*
- **icon**: enables rendering of site favicon for URL in `data` attribute.
- **iconSize**: size of favicon if rendered. *Default: 64*
- **modulefn**: see "Advanced usage" section.

### Advanced usage:
#### Custom module shape:
Module shape can be customized by providing a string
with JS function code in `modulefn` attribute.

Function arguments:
1. x coordinate of module
2. y coordinate of module
3. margin
4. 2D array of modules as boolean values

Function must return the module as a rendered SVG part.

[Function samples](module-fn.js)
