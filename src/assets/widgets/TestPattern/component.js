// Receives the widget, widgetModule and entries as props.
export default {
	data() {
		return {
			timecode: "",
			animation: {}
		}
	},
	computed: {
		imageUrl: function() {
			return "/mediafiles/" + this.widget.props.pattern
		}
	},
	methods: {
		generateTimecode() {
			this.timecode = moment().format("hh:mm:ss:SS A")
		},
		startRotation() {
			// Delay start of animation until we hit the exact next second
			const time = Date.now()
			const nextSecond = Math.ceil(time / 1000) * 1000
			setTimeout(() => {
				this.animation = gsap.fromTo(
					this.$refs.syncmarker,
					{ rotation: 0 },
					{
						rotation: 360,
						ease: "power0",
						onComplete: this.startRotation,
						duration: 1.98
						// repeat: -1
					}
				)
			}, nextSecond - time)
		}
	},
	mounted() {
		setInterval(this.generateTimecode, 20)
		this.startRotation()
	},
	beforeDestroy() {
		this.animation.kill()
	}
}
