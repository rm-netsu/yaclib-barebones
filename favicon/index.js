const sheet = new CSSStyleSheet()
sheet.replaceSync(//css
`IMG { width: 100%; display: block; }`
)

const defaults = {
	url: null,
	size: 64,
}


export class YACFaviconComponent extends HTMLElement {
	static observedAttributes = Object.keys(defaults)
	#state = { ...defaults }
	#favicon
	#onload
	
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.shadowRoot.adoptedStyleSheets = [sheet]

		this.#favicon = document.createElement('img')
		this.shadowRoot.append(this.#favicon)
		
		this.render()
	}

	get onload() { return this.#onload }
	set onload(fn) { this.#onload = fn }
	
	attributeChangedCallback($a, oldValue, newValue) {
		if(newValue === null) this.#state[$a] = defaults[$a]
		else switch($a) {
			case 'url':
				this.#state[$a] = newValue
			break
			case 'size':
				this.#state[$a] = Number.parseInt(newValue)
			break
		}
		
		this.render()
	}
	
	render() {
		const { url, size } = this.#state
		if(url === null) return;

		const hostname = new URL(url).hostname
		const src = (hostname === 'localhost')
			? `/favicon.ico`
			: `http://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`
		this.#favicon.onload = this.#onload
		this.#favicon.src = src
	}
}

customElements.define('yac-favicon', YACFaviconComponent)
