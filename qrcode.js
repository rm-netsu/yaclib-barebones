/*
<yac-qrcode
	url={string}
	correction={'H'|'M'|'L'}
	margin={number}
	cellsize={number}>
	cellfn={(x, y, c) => `<svg-element ... />`}
</yac-qrcode>
*/

import qrcode from 'qrcode-generator-es6'

/** Sample function for square cells */
export const squareFn = (x, y, c) => `<rect
	width="${c}"
	height="${c}"
	x="${x}"
	y="${y}"
	fill="black"
	shape-rendering="crispEdges"
/>`

/** Sample function for circle cells */
export const circleFn = (x, y, c) => `<circle
	r="${c/2}"
	cx="${x +c/2}"
	cy="${y +c/2}"
	fill="black"
	shape-rendering="crispEdges"
/>`

const sheet = new CSSStyleSheet()
sheet.replaceSync(
`.wrap { position: relative; }
SVG { display: block; }
.bg {
	background: --var(bg, white);
	position: absolute; left: 0; top: 0; bottom: 0; right: 0; z-index: -1;
}`
)

const defaults = {
	margin: 1,
	cellsize: 1,
	url: document.baseURI,
	correction: 'M',
	cellfn: squareFn,
}

const template = modules =>
`<div class='wrap'>
<slot name='background'><div class='bg'></div></slot>
${modules}
</div>`

export default class HTMLQrCodeElement extends HTMLElement {
	static observedAttributes = ['margin', 'cellsize', 'url', 'correction', 'cellfn']
	#state = { ...defaults }
	
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.shadowRoot.adoptedStyleSheets = [sheet]
		
		this.render()
	}
	
	attributeChangedCallback($a, oldValue, newValue) {
		if(newValue === null) this.#state[$a] = defaults[$a]
		else switch($a) {
			case 'margin':
			case 'cellsize':
				this.#state[$a] = Number.parseFloat(newValue)
			break
			case 'url':
				this.#state[$a] = newValue
			break
			case 'correction':
				this.#state[$a] = newValue.toUpperCase()
			break
			case 'cellfn':
				this.#state[$a] = new Function(`return ${newValue}`)()
			break
		}
		
		this.render()
	}
	
	render() {
		const qr = new qrcode(0, this.#state.correction)
		qr.addData(this.#state.url)
		qr.make()
		
		const moduleCount = qr.getModuleCount()
		
		const { margin, cellsize, cellfn } = this.#state
		
		const sideLength = moduleCount * cellsize + margin*2
		
		const cells = []
		for(let Y = 0; Y < moduleCount; ++Y)
		for(let X = 0; X < moduleCount; ++X)
		if(qr.isDark(Y, X))
			cells.push(cellfn(X * cellsize + margin, Y * cellsize + margin, cellsize))
		
		const svg = `<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 ${sideLength} ${sideLength}"
			preserveAspectRatio="xMinYMin meet"
		>${
			cells.join('')
		}</svg>`
		
		this.shadowRoot.innerHTML = template(svg)
	}
}
customElements.define('yac-qrcode', HTMLQrCodeElement)
