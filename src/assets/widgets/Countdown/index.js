module.exports = {
	name: "Countdown",
	description: "Shows a customizeable countdown to a target date / time",
	category: "Time",
	icon: "stopwatch",
	hasEntries: false,
	default: {
		style: {
			horizontal_position: "left",
			vertical_position: "top"
		},
		props: {
			type: "countdown",
			seconds: 60,
			count_up: false,
			running: true,
			format: "$D days $HH hours $MM minutes $SS seconds"
		}
	},
	props: [
		{
			name: "running",
			description: "Timer is running",
			type: "Radio",
			options: [
				{
					name: "Running",
					value: true
				},
				{
					name: "Paused",
					value: false
				}
			]
		},
		{
			name: "type",
			description:
				"What type of countdown? Timer ticks away seconds (i.e. 15 seconds remaining), countdown awaits a set moment in time (i.e. launching at 3PM on thursday).",
			type: "Radio",
			options: [
				{
					name: "Countdown",
					value: "countdown"
				},
				{
					name: "Timer",
					value: "timer"
				}
			]
		},
		{
			name: "seconds",
			description: "Target number of seconds (used when type is set to Timer)",
			type: "Number"
		},
		{
			name: "target",
			description: "Target date & time (used when type is set to Countdown)",
			type: "Datetime"
		},
		{
			name: "count_up",
			description: "Continue counting after reaching 0",
			type: "Radio",
			options: [
				{
					name: "Stop at zero",
					value: false
				},
				{
					name: "Continue",
					value: true
				}
			]
		},
		{
			name: "format",
			description: "Countdown format",
			type: "Select",
			options: [
				{
					name: "Time in words",
					value: "humanize"
				},
				{
					name: "D days HH hours MM minutes SS seconds",
					value: "$D days $HH hours $MM minutes $SS seconds"
				},
				{
					name: "D:HH:MM:SS",
					value: "$D:$HH:$MM:$SS"
				},
				{
					name: "HH:MM:SS",
					value: "$HH:$MM:$SS"
				},
				{
					name: "MM:SS",
					value: "$MM:$SS"
				},
				{
					name: "M:S",
					value: "$M:$S"
				},
				{
					name: "Custom format",
					value: "custom"
				}
			]
		},
		{
			name: "customformat",
			description:
				"Custom format. Used if countdown format is set to 'custom'. Use variables $D $HH $MM $SS for days, hours, minutes, secunds.",
			type: "String"
		}
	],
	// methods: {
	// 	pauseresume () {
	// 		this.props.running = !this.props.running
	// 		this.save()
	// 		return true
	// 	}
	// },
	// actions: [
	// 	{
	// 		name: "pauseresume",
	// 		title: "Pause / resume",
	// 		description: "Pause / resume the countdown clock (will not adjust target)",
	// 		type: "Button",
	// 		style: { type: "warning" },
	// 		method: "pauseresume"
	// 	}
	// ],
	vue_template: '<div class="countdown"><span>{{counter}}</span></div>',
	vue_component: getFile("component.js").toString(),
	css: ".countdown{ font-variant-numeric: tabular-nums; }"
}
