module.exports = {
	name: "Gradient",
	description: "Paints a gradient on screen",
	category: "Background",
	icon: "image",
	selfPositioning: true,
	selfSizing: true,
	selfWrapping: true,
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
			name: "angle",
			description: "Gradient angle",
			type: "Radio",
			options: [
				{
					name: "0°",
					value: "0deg"
				},
				{
					name: "45°",
					value: "45deg"
				},
				{
					name: "90°",
					value: "90deg"
				},
				{
					name: "135°",
					value: "135deg"
				},
				{
					name: "180°",
					value: "180deg"
				},
				{
					name: "225°",
					value: "225deg"
				},
				{
					name: "270°",
					value: "270deg"
				},
				{
					name: "315°",
					value: "315deg"
				}
			]
		},
		{
			name: "type",
			description: "Gradient type",
			type: "Radio",
			options: [
				{
					name: "Linear",
					value: "linear"
				},
				{
					name: "Radial",
					value: "radial"
				}
			]
		}
	],
	default: {
		style: {
			widget_wrapping: false
		},
		props: {
			color1: "rgba(50,50,50,1)",
			color2: "rgba(30,30,30,1)",
			angle: "90deg",
			type: "linear"
		}
	},
	vue_component: getFile("component.js").toString(),
	vue_template: `<div class="gradient" :style="gradientStyle"></div>`,
	css: getFile("style.css").toString()
}
