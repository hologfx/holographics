module.exports = {
	name: "Ticker",
	version: "1.11.0-beta.1",
	description: "Displays a scrolling ticker tape",
	category: "Basic",
	icon: "newspaper",
	hasEntries: true,
	multipleVisibleEntries: true,
	default: {
		style: {
			horizontal_position: "center",
			vertical_position: "bottom",
			width: "100"
		},
		props: {
			speed: 100
		}
	},
	props: [
		{
			name: "speed",
			description: "Speed (px/sec)",
			type: "String"
		}
	],
	entry_props: [
		{
			name: "text",
			description: "Text",
			type: "String"
		},
		{
			name: "icon",
			description: "Icon",
			type: "IconSearch"
		}
	],
	vue_template: renderPug(getFile("template.pug").toString()),
	vue_component: getFile("component.js").toString(),
	css: renderStylus(getFile("style.styl").toString())
}
