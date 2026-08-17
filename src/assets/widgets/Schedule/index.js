module.exports = {
	name: "Schedule",
	description: "Shows the schedule for a given day on screen",
	category: "Time",
	icon: "calendar",
	hasEntries: true,
	multipleVisibleEntries: true,
	default: {
		style: {
			horizontal_position: "right",
			vertical_position: "top",
			width: 20,
			global_padding: "0",
			height: 100
		},
		props: {
			showPastEvents: true,
			pastEventColor: "rgb(100,100,100)",
			showUpcomingCountdown: true,
			showRemainingCountdown: true,
			showDuration: true,
			countdownLabelActive: "Remaining: ",
			countdownLabelUpcoming: "Starts in: ",
			countdownFormat: "HH:mm:ss",
			durationFormat: "minutes",
			durationLabel: "minutes"
		}
	},
	props: [
		{
			name: "showPastEvents",
			description: "Show past events",
			type: "Radio",
			options: [
				{
					name: "Show",
					value: true
				},
				{
					name: "Hide",
					value: false
				}
			]
		},
		{
			name: "pastEventColor",
			description: "Text color for past events",
			type: "ColorPicker"
		},
		{
			name: "showUpcomingCountdown",
			description: "Show countdowns to upcoming events",
			type: "Radio",
			options: [
				{
					name: "Show",
					value: true
				},
				{
					name: "Hide",
					value: false
				}
			]
		},
		{
			name: "showRemainingCountdown",
			description:
				"Show countdown for time remaining on currently active event",
			type: "Radio",
			options: [
				{
					name: "Show",
					value: true
				},
				{
					name: "Hide",
					value: false
				}
			]
		},
		{
			name: "countdownLabelUpcoming",
			description: "Countdown label for upcoming events",
			type: "String"
		},
		{
			name: "countdownLabelActive",
			description: "Countdown label for currently happening events",
			type: "String"
		},
		{
			name: "countdownFormat",
			description: "What format to show for the countdown",
			type: "Radio",
			options: [
				{
					name: "HH:MM:SS",
					value: "HH:mm:ss"
				},
				{
					name: "HH:MM",
					value: "HH:mm"
				},
				{
					name: "MM:SS",
					value: "mm:ss"
				}
			]
		},
		{
			name: "showDuration",
			description: "Show event duration",
			type: "Radio",
			options: [
				{
					name: "Show",
					value: true
				},
				{
					name: "Hide",
					value: false
				}
			]
		},
		{
			name: "durationFormat",
			description: "Event duration format",
			type: "Radio",
			options: [
				{
					name: "Seconds",
					value: "seconds"
				},
				{
					name: "Minutes",
					value: "minutes"
				},
				{
					name: "Hours",
					value: "hours"
				}
			]
		},
		{
			name: "durationLabel",
			description: "Event duration label",
			type: "String"
		}
	],
	entry_props: [
		{
			name: "name",
			description: "Name of schedule event",
			type: "String"
		},
		{
			name: "description",
			description: "Description of schedule event",
			type: "String"
		},
		{
			name: "time",
			description: "Time",
			type: "Datetime"
		}
	],
	vue_template: renderPug(getFile("template.pug").toString()),
	vue_component: getFile("component.js").toString(),
	css: renderStylus(getFile("style.styl").toString())
}
