module.exports = {
	name: "Timeline",
	description: "Shows a timeline of events on screen",
	category: "Time",
	icon: "calendar",
	hasEntries: true,
	multipleVisibleEntries: true,
	selfWrapping: true,
	selfSizing: true,
	default: {
		style: {
			horizontal_position: "center",
			vertical_position: "bottom",
			widget_wrapping: false
		},
		props: {
			width: 1280,
			progressMethod: "auto",
			progress: 0,
			progressBarRounding: 7,
			progressBarFill: "rgb(255,255,255)",
			progressBarRemainingFill: "rgb(219, 219, 219)",
			progressBarCompletedFill: "rgb(69, 151, 251)",
			CTIFill: "rgb(255,255,255)",
			CTIRadius: 12,
			markerWidth: 5,
			markerFill: "rgb(255,255,255)",
			markerTimeFill: "rgb(255,255,255)",
			markerNameFill: "rgb(255,255,255)"
		}
	},
	props: [
		{
			name: "width",
			description: "Width",
			type: "Number"
		},
		{
			name: "progressMethod",
			description:
				"Progress: automatically or with manual input. Auto uses current time, scaled to the starting and ending time defined below. Manual is based on user input.",
			type: "Radio",
			options: [
				{
					name: "Automatic",
					value: "auto"
				},
				{
					name: "Manual",
					value: "manual"
				}
			]
		},
		{
			name: "progress",
			description: "Manual progress: enter number between 0 and 100",
			type: "Number"
		},
		{
			name: "progressStart",
			description: "Progress bar starting time",
			type: "Datetime"
		},
		{
			name: "progressEnd",
			description: "Progress bar ending time",
			type: "Datetime"
		},
		{
			name: "progressBarRounding",
			description: "Progress bar corner rounding",
			type: "Number"
		},
		{
			name: "progressBarFill",
			description: "Progress bar fill color",
			type: "ColorPicker"
		},
		{
			name: "progressBarRemainingFill",
			description: "Progress bar remaining fill color",
			type: "ColorPicker"
		},
		{
			name: "progressBarCompletedFill",
			description: "Progress bar completed fill color",
			type: "ColorPicker"
		},
		{
			name: "CTIRadius",
			description: "Current time indicator radius",
			type: "Number"
		},
		{
			name: "CTIFill",
			description: "Current time indicator fill color",
			type: "ColorPicker"
		},
		{
			name: "markerWidth",
			description: "Marker width",
			type: "Number"
		},
		{
			name: "markerFill",
			description: "Marker fill color",
			type: "ColorPicker"
		},
		{
			name: "markerTimeFill",
			description: "Marker time text color",
			type: "ColorPicker"
		},
		{
			name: "markerNameFill",
			description: "Marker name text color",
			type: "ColorPicker"
		}
	],
	entry_props: [
		{
			name: "name",
			description: "Name of timeline event",
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
