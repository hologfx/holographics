module.exports = {
	name: "Solid color",
	description: "Paints a solid color on screen",
	category: "Background",
	icon: "image",
	props: [
		{
			name: "color",
			description: "Color",
			type: "ColorPicker"
		}
	],
	default: {
		style: {
			widget_wrapping: false
		},
		props: {
			color: "rgba(255,255,255,1)"
		}
	},
	selfPositioning: true,
	selfSizing: true,
	selfWrapping: true,
	vue_component: getFile("component.js").toString(),
	vue_template: `<div class="solidcolor" :style="solidColorStyle"></div>`,
	css: getFile("style.css").toString()
}
