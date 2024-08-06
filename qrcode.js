/*
<yac-qrcode
	url={string}
	correction={'H'|'M'|'L'}
	margin={number}
	cellsize={number}>
</yac-qrcode>
*/

import qrcode from 'qrcode-generator-es6'

const sheet = new CSSStyleSheet()
sheet.replaceSync('SVG { display: block; }')

const defaults = {
	margin: 1,
	cellsize: 1,
	url: document.baseURI,
	correction: 'M',
}

export default class HTMLQrCodeElement extends HTMLElement {
	static observedAttributes = ['margin', 'cellsize', 'url', 'correction']
	#state = { ...defaults }
	
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.shadowRoot.adoptedStyleSheets = [sheet]
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
		}
		
		this.render()
	}
	
	render() {
		const qr = new qrcode(0, this.#state.correction)
		qr.addData(this.#state.url)
		qr.make()
		
		this.shadowRoot.innerHTML = qr.createSvgTag({
			margin: this.#state.margin,
			cellSize: this.#state.cellsize
		})
	}
}
customElements.define('yac-qrcode', HTMLQrCodeElement)
