// Receives the widget, widgetModule and entries as props.
export default {
	computed: {
		gradientStyle() {
			return {
				background: this.gradient
			}
		},
		gradient() {
			if (this.widget.props.type === "linear") {
				return `linear-gradient(${this.widget.props.angle}, ${this.widget.props.color1}, ${this.widget.props.color2})`
			} else {
				return `radial-gradient(${this.widget.props.color1}, ${this.widget.props.color2})`
			}
		}
	}
}
