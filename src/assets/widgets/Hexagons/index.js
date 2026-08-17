module.exports = {
	name: "Hexagons",
	version: "1.1",
	description: "Animated hexagons background",
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
			name: "animation_delay",
			description: "Time before animation starts",
			requires_refresh: true,
			type: "Number"
		},
		{
			name: "animation_duration",
			description: "Duration for each animation",
			requires_refresh: true,
			type: "Number"
		},
		{
			name: "animation_overlap",
			description: "Overlap between animation starts",
			requires_refresh: true,
			type: "Number"
		},
		{
			name: "stagger",
			description: "Stagger animations on individual hexagon elements",
			requires_refresh: true,
			type: "Number"
		},
		{
			name: "stagger_from",
			description: "Stagger from",
			requires_refresh: true,
			type: "Select",
			options: [
				{
					name: "Center",
					value: "center"
				},
				{
					name: "Start",
					value: "start"
				},
				{
					name: "End",
					value: "end"
				},
				{
					name: "Edges",
					value: "edges"
				},
				{
					name: "Random",
					value: "random"
				}
			]
		}
	],
	default: {
		style: {
			widget_wrapping: false
		},
		props: {
			color1: "rgba(65, 65, 65, 1)",
			color2: "rgba(0, 0, 0, 1)",
			animation_delay: 10,
			animation_duration: 15,
			animation_overlap: -1,
			stagger: 4,
			stagger_from: "center"
		}
	},
	category: "Background",
	icon: "image",
	selfPositioning: true,
	selfSizing: true,
	selfWrapping: true,
	selfAnimating: true,
	vue_component: getFile("component.js").toString(),
	vue_template: getFile("hexagons.html").toString(),
	css: getFile("style.css").toString()
}
