module.exports = {
	name: "Fullscreen message",
	description: "Shows a message onscreen, fully obscuring the background",
	category: "Basic",
	icon: "pause-circle",
	hasEntries: true,
	multipleVisibleEntries: false,
	selfPositioning: true,
	selfSizing: true,
	selfWrapping: true,
	default: {
		style: {
			widget_wrapping: false,
			widget_padding: 0,
			widget_repositioning: false
		},
		props: {
			image: "holographics_logo.png"
		}
	},
	style_presets: [],
	props: [
		{
			name: "background_color",
			description:
				"What color variable should be used for the color of the background?",
			type: "Select",
			options: [
				{
					name: "Primary Color",
					value: "primary_color"
				},
				{
					name: "Secondary Color",
					value: "secondary_color"
				},
				{
					name: "Background A",
					value: "background_a"
				},
				{
					name: "Background B",
					value: "background_b"
				}
			]
		},
		{
			name: "image",
			description: "Show the selected image",
			type: "ImageFile"
		}
	],
	entry_props: [
		{
			name: "message",
			description: "Message to display",
			type: "String"
		},
		{
			name: "message2",
			description: "Second message to display",
			type: "String"
		}
	],
	methods: {
		sayHello: function() {
			console.log("hello")
		}
	},
	sidebar: [
		{
			name: "helloworld",
			description: "Hello world button",
			type: "button",
			action: () => {
				widget.methods.sayHello()
			}
		}
	],
	vue_component: getFile("component.js").toString(),
	vue_template: renderPug(getFile("template.pug").toString()),
	css: renderStylus(getFile("style.styl").toString())
}
