module.exports = {
	name: "Image",
	description: "Shows an image on-screen",
	category: "Basic",
	icon: "image",
	hasEntries: false,
	default: {
		style: {
			horizontal_position: "right",
			vertical_position: "top",
			width: "25",
			widget_wrapping: false,
			widget_padding: 0
		},
		props: {
			image: "holographics_logo.png"
		}
	},
	props: [
		{
			name: "image",
			description: "Show the selected image",
			type: "ImageFile"
		}
	],
	vue_template: '<div class="image"><img :src="imageUrl" /></div>',
	vue_component: getFile("component.js").toString(),
	css: renderStylus(`.image{
		img {
			width: 100%;
			height: auto;
		}
	}`)
}
