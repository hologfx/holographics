module.exports = {
	name: "Test Pattern",
	description: "Shows industry standard test patterns on screen",
	category: "Utility",
	icon: "vial",
	hasEntries: false,
	selfPositioning: true,
	selfSizing: true,
	selfWrapping: true,
	default: {
		style: {
			horizontal_position: "center",
			vertical_position: "center",
			widget_wrapping: false
		},
		props: {
			showTimecode: true,
			showSync: true,
			pattern: "EBU_Colorbars.svg"
		}
	},
	props: [
		{
			name: "signaltitle",
			description: "Signal title",
			type: "String"
		},
		{
			name: "location",
			description: "Location info",
			type: "String"
		},
		{
			name: "contact",
			description: "Contact info",
			type: "String"
		},
		{
			name: "pattern",
			description: "Test pattern to display",
			type: "Select",
			options: [
				{
					name: "EBU Colorbars",
					value: "EBU_Colorbars.svg"
				},
				{
					name: "PM5644",
					value: "PM5644.svg"
				},
				{
					name: "SMPTE 4:3",
					value: "SMPTE-43.svg"
				},
				{
					name: "SMPTE 16:9",
					value: "SMPTE-169.svg"
				}
			]
		},
		{
			name: "showTimecode",
			description: "Show timecode (generated internally)",
			type: "Radio",
			options: [
				{
					name: "On",
					value: true
				},
				{
					name: "Off",
					value: false
				}
			]
		},
		{
			name: "showSync",
			description: "Show sync indicator)",
			type: "Radio",
			options: [
				{
					name: "On",
					value: true
				},
				{
					name: "Off",
					value: false
				}
			]
		}
	],
	vue_template:
		'<div class="testpattern"><h2 style="font-weight: 700;" v-html="widget.props.signaltitle"></h2><h2 v-html="widget.props.location"></h2><h2></h2><h2 class="timecode" v-if="widget.props.showTimecode">{{ timecode }}</h2><div class="syncmarker" ref="syncmarker" v-if="widget.props.showSync"><div class="dot"></div></div><img :src="imageUrl"/></div>',
	vue_component: getFile("component.js").toString(),
	css: renderStylus(getFile("style.styl").toString())
}
