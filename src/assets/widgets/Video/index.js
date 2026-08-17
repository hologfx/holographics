module.exports = {
	name: "Video",
	description: "Shows a video. You can use MP4, Webm or OGG file formats.",
	category: "Video",
	icon: "film",
	hasEntries: false,
	default: {
		style: {
			horizontal_position: "center",
			vertical_position: "center",
			width: "100",
			widget_wrapping: false,
			widget_padding: 0,
			global_padding: 0
		},
		props: {
			video: undefined,
			loop: false
		}
	},
	props: [
		{
			name: "video",
			description: "Show the selected video",
			type: "VideoFile"
		},
		{
			name: "loop",
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
		}
	],
	vue_template:
		'<div class="video"><video :src="videoUrl" autoplay="autoplay" :loop="widget.props.loop"></video></div>',
	vue_component: getFile("component.js").toString(),
	css: renderStylus(`.video{
		video {
			width: 100%;
			height: auto;
		}
	}`)
}
