# YACLib (Yet Another Component Library)
Collection of web components written as native ES6 modules.
(To be rewritten in TypeScript later.)

## Basic usage:
Add the following code into `<head>` tag of your page:
```html
<!-- add importmap before any module imports -->
<script type="importmap">
{
	"imports": {
		"qrcode-generator-es6": "https://unpkg.com/qrcode-generator-es6@1.1.4/index.js"
	}
}
</script>

<!-- import yaclib -->
<script
	type="module"
	src="https://rm-netsu.github.io/yaclib-barebones/index.js"
></script>
```

For basic usage no more code required. Just import and use components in HTML.

If you do not want to import entire YACLib, you can import individual components:
```html
<!-- don't forget to add importmap before any module imports -->

<script
	type="module"
	src="https://rm-netsu.github.io/yaclib-barebones/componentA/index.js"
></script>
<script
	type="module"
	src="https://rm-netsu.github.io/yaclib-barebones/componentB/index.js"
></script>
<!-- ... -->
```

Currently available components:
- [QR code](qrcode/index.md)
