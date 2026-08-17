module.exports = {
	name: "Lower Third",
	description: "Displays a lower third",
	category: "Basic",
	icon: "user",
	hasEntries: true,
	multipleVisibleEntries: false,
	default: {
		style: {
			horizontal_position: "left",
			vertical_position: "bottom",
			width: "50"
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
	css: renderStylus(getFile("style.styl").toString())
}
