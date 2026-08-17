module.exports = {
	name: "Confetti",
	description: "Renders confetti on screen",
	category: "Fun",
	icon: "image",
	selfPositioning: true,
	selfSizing: true,
	selfWrapping: true,
	selfAnimating: true,
	default: {
		style: {
			widget_wrapping: false
		}
	},
	vue_template: "<div><canvas ref='confetti'></canvas></div>",
	vue_component: getFile("component.js").toString()
}
