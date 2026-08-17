module.exports = {
	name: "Moving Gradient",
	description: "Paints a gradient on screen that slowly changes colors",
	category: "Background",
	icon: "image",
	props: [
		{
			name: "color1",
			description: "Color 1",
			type: "ColorPicker"
		},
		{
			name: "color2",
			description: "Color 2",
			type: "ColorPicker"
		},
		{
			name: "color3",
			description: "Color 3",
			type: "ColorPicker"
		},
		{
			name: "color4",
			description: "Color 4",
			type: "ColorPicker"
		},
		{
			name: "duration",
			description: "Animation duration",
			requires_refresh: true,
			type: "Number"
		}
	],
	default: {
		style: {
			widget_wrapping: false
		},
		props: {
			color1: "#ee7752",
			color2: "#e73c7e",
			color3: "#23a6d5",
			color4: "#23d5ab",
			duration: 20
		}
	},
	selfPositioning: true,
	selfSizing: true,
	selfWrapping: true,
	vue_component: getFile("component.js").toString(),
	vue_template: `<div :style="movingGradientStyle" ref="movingGradient"></div>`,
	css: getFile("style.css").toString()
}
