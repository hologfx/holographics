module.exports = {
	name: "YouTube Video",
	description:
		"Shows a YouTube video onscreen. <strong>Note:</strong> not all browsers will autoplay video, interaction may be required</strong>",
	category: "Video",
	icon: "youtube",
	hasEntries: false,
	default: {
		style: {
			horizontal_position: "center",
			vertical_position: "center",
			width: 60
		},
		props: {
			videoUrl: "https://www.youtube.com/watch?v=bCPEidaVzQU",
			looping: true,
			aspect: "16by9"
		}
	},
	props: [
		{
			name: "videoUrl",
			description: "YouTube URL",
			type: "String"
		},
		{
			name: "looping",
			description: "Video should loop",
			type: "Radio",
			options: [
				{
					name: "Loop",
					value: true
				},
				{
					name: "Play once",
					value: false
				}
			]
		},
		{
			name: "aspect",
			description: "Player aspect ratio",
			type: "Radio",
			options: [
				{
					name: "21:9",
					value: "21by9"
				},
				{
					name: "18:9",
					value: "18by9"
				},
				{
					name: "16:9",
					value: "16by9"
				},
				{
					name: "14:3",
					value: "4by3"
				},
				{
					name: "1:1",
					value: "1by1"
				}
			]
		}
	],
	vue_template: renderPug(getFile("template.pug").toString()),
	vue_component: getFile("component.js").toString(),
	css: renderStylus(getFile("style.styl").toString())
}
