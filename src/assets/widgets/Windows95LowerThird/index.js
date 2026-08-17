module.exports = {
	name: "Windows 95 Lower Third",
	description: "Displays a lower third in Windows 95 style",
	category: "Fun",
	icon: "user",
	hasEntries: true,
	multipleVisibleEntries: false,
	selfWrapping: true,
	default: {
		style: {
			horizontal_position: "left",
			vertical_position: "bottom",
			width: "50",
			widget_wrapping: false,
			widget_padding: 0
		}
	},
	entry_props: [
		{
			name: "name",
			description: "Name",
			type: "String"
		},
		{
			name: "job_title",
			description: "Job title",
			type: "String"
		},
		{
			name: "company",
			description: "Company",
			type: "String"
		}
	],
	vue_template: renderPug(getFile("template.pug").toString()),
	vue_component: getFile("component.js").toString(),
	css: renderStylus(getFile("style.styl").toString())
}
