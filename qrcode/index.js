import qrcode from 'qrcode-generator-es6'
import * as moduleFn from './module-fn.js'


const sheet = new CSSStyleSheet()
sheet.replaceSync(//css
`SVG { display: block; }
.wrap { position: relative; }
.bg {
	background: var(--bg, white);
	position: absolute; left: 0; top: 0; bottom: 0; right: 0; z-index: -1;
}
.favicon:not([src]) { display: none; }
.favicon {
	position: absolute; left: 50%; top: 50%; width: 20%; aspect-ratio: 1;
	transform: translate(-50%, -50%);
}`
)

const defaults = {
	data: document.baseURI,
	correction: 'M',
	margin: 1,
	icon: false,
	modulefn: moduleFn.square,
}

const template = modules => //html
`<div class='wrap'>
<slot name='background'><div class='bg'></div></slot>
${modules}
<slot name='overlay'><img class='favicon' /></slot>
</div>`


export class YACQrCodeComponent extends HTMLElement {
	static observedAttributes = [
		'data',
		'correction',
		'margin',
		'icon',
		'modulefn',
	]
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
			case 'data':
				this.#state[$a] = newValue
			break
			case 'correction':
				this.#state[$a] = newValue.toUpperCase()
			break
			case 'margin':
				this.#state[$a] = Number.parseFloat(newValue)
			break
			case 'icon':
				this.#state[$a] = this.hasAttribute('icon')
			break
			case 'modulefn':
				this.#state[$a] = new Function(`return ${newValue}`)()
			break
		}
		
		this.render()
	}
	
	render() {
		const { data, correction, margin, icon, modulefn } = this.#state

		const qr = new qrcode(0, correction)
		qr.addData(data)
		qr.make()
		
		const moduleCount = qr.getModuleCount()
		
		const sideLength = moduleCount + margin*2
		
		const modules = []
		for(let Y = 0; Y < moduleCount; ++Y)
		for(let X = 0; X < moduleCount; ++X)
		if(qr.isDark(Y, X))
			modules.push(modulefn(X, Y, margin, modules))
		
		const svgTemplate = //svg
		`<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 ${sideLength} ${sideLength}"
			preserveAspectRatio="xMinYMin meet"
		>${modules.join('')}</svg>`
		
		this.shadowRoot.innerHTML = template(svgTemplate)

		const svg = this.shadowRoot.querySelector('svg')

		const favicon = this.shadowRoot.querySelector('.favicon')
		const domain = new URL(data).hostname
		if(icon && favicon && domain !== 'localhost') {
			const src = `http://www.google.com/s2/favicons?domain=${domain}&sz=64`
			favicon.src = src

			favicon.onload = () => {
				const iconRect = favicon.getBoundingClientRect()
				const els = [...svg.querySelectorAll('*')]

				els.forEach(el => {
					const rect = el.getBoundingClientRect()
					if(
						(
							(rect.left >= iconRect.left && rect.left < iconRect.right) ||
							(rect.right <= iconRect.right && rect.right > iconRect.left)
						) && (
							(rect.top >= iconRect.top && rect.top < iconRect.bottom) ||
							(rect.bottom <= iconRect.bottom && rect.bottom > iconRect.top)
						)
					) el.remove()
				})
			}
		}
	}
}

customElements.define('yac-qrcode', YACQrCodeComponent)
