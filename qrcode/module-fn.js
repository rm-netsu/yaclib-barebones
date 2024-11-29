/** Sample function for rendering modules as squares */
export const square = (x, y, m) => //svg
`<rect
	width="1"
	height="1"
	x="${x+m}"
	y="${y+m}"
	fill="black"
	shape-rendering="crispEdges"
/>`

/** Sample function for rendering modules as circles */
export const circle = (x, y, m) => //svg
`<circle
	r="0.5"
	cx="${x+m +0.5}"
	cy="${y+m +0.5}"
	fill="black"
	shape-rendering="crispEdges"
/>`
