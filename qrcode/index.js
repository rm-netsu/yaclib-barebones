import qrcode from 'qrcode-generator-es6'
import { YACFaviconComponent } from '../favicon/index.js'
import * as moduleFn from './module-fn.js'


const sheet = new CSSStyleSheet()
sheet.replaceSync(//css
`SVG { display: block; }
.wrapper { position: relative; }
.background-fill {
	background: var(--bg, white);
	position: absolute; left: 0; top: 0; bottom: 0; right: 0; z-index: -1;
}
yac-favicon:not([url]) { display: none; }
yac-favicon {
	position: absolute; left: 50%; top: 50%; width: 20%; aspect-ratio: 1;
	transform: translate(-50%, -50%);
}`
)

const defaults = {
	data: document.baseURI,
	correction: 'M',
	margin: 1,
	icon: false,
	iconSize: 64,
	modulefn: moduleFn.square,
}


export class YACQrCodeComponent extends HTMLElement {
	static observedAttributes = Object.keys(defaults)
	#state = { ...defaults }
	#svg; #favicon
	
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.shadowRoot.adoptedStyleSheets = [sheet]

		const wrapper = document.createElement('div')
		wrapper.className = 'wrapper'
			const background = document.createElement('slot')
			background.name = 'background'
				const bgFill = document.createElement('div')
				bgFill.className = 'background-fill'
				background.append(bgFill)
			
			this.#svg = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'svg'
			)
			this.#svg.setAttribute('preserveAspectRatio', 'xMinYMin meet')
			
			const overlay = document.createElement('slot')
			overlay.name = 'overlay'
				this.#favicon = new YACFaviconComponent()
				overlay.append(this.#favicon)

			wrapper.append(background, this.#svg, overlay)
		this.shadowRoot.append(wrapper)
		
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
			case 'iconSize':
				this.#state[$a] = Number.parseInt(newValue)
			break
			case 'modulefn':
				this.#state[$a] = new Function(`return ${newValue}`)()
			break
		}
		
		this.render()
	}
	
	render() {
		const {
			data,
			correction,
			margin,
			icon,
			iconSize,
			modulefn,
		} = this.#state

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

		this.#svg.setAttribute('viewBox', `0 0 ${sideLength} ${sideLength}`)
		this.#svg.innerHTML = modules.join('')

		if(icon) {
			this.#favicon.onload = () => {
				const iconRect = this.#favicon.getBoundingClientRect()
				const els = [...this.#svg.querySelectorAll('*')]

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
			this.#favicon.setAttribute('url', data)
			this.#favicon.setAttribute('size', iconSize)
		}
	}
}

customElements.define('yac-qrcode', YACQrCodeComponent)
