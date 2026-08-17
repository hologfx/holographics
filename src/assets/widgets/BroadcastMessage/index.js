module.exports = {
	name: "Broadcast Message",
	description: "Shows a simple message on screen",
	category: "Basic",
	icon: "bullhorn",
	hasEntries: true,
	multipleVisibleEntries: false,
	default: {
		style: {
			horizontal_position: "center",
			vertical_position: "bottom"
		}
	},
	style_presets: [
		{
			name: "Lower",
			slug: "lower",
			values: {
				horizontal_position: "center",
				vertical_position: "bottom"
			}
		},
		{
			name: "Center Screen",
			slug: "center_screen",
			values: {
				horizontal_position: "center",
				vertical_position: "center"
			}
		}
	],
	entry_props: [
		{
			name: "message",
			description: "Message to display",
			type: "String"
		},
		{
			name: "icon",
			description: "Icon",
			type: "IconSearch"
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
	vue_template: renderPug(getFile("template.pug").toString()),
	css: renderStylus(getFile("style.styl").toString())
}
