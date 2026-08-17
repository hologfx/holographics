module.exports = {
	name: "Clock",
	description: "Shows the current time on-screen",
	version: "1.10",
	category: "Time",
	icon: "clock",
	hasEntries: false,
	default: {
		style: {
			horizontal_position: "left",
			vertical_position: "top"
		},
		props: {
			timeformat: "12H"
		}
	},
	props: [
		{
			name: "timeformat",
			description: "Show current time as 12 or 24 hour clock",
			type: "Radio",
			options: [
				{
					name: "12 Hour Display",
					value: "12H"
				},
				{
					name: "24 Hour Display",
					value: "24H"
				}
			]
		}
	],
	vue_template:
		'<div class="clock"><span ref="clock">{{currentTime}}</span></div>',
	vue_component: getFile("component.js").toString(),
	css: ".clock{ font-variant-numeric: tabular-nums; }"
}
