// Receives the widget, widgetModule and entries as props.
export default {
	mounted() {
		const tl = gsap.timeline({
			repeat: -1,
			yoyo: true
		})
		this.destination = tl.to(this.$refs.movingGradient, {
			duration: this.widget.props.duration,
			x: "-75%",
			ease: "sine"
		})
	},
	computed: {
		movingGradientStyle() {
			return {
				background: this.gradient
			}
		},
		gradient() {
			return `linear-gradient(90deg, ${this.widget.props.color1}, ${this.widget.props.color2}, ${this.widget.props.color3}, ${this.widget.props.color4})`
		}
	}
}
