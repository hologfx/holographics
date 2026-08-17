// Receives the widget, widgetModule and entries as props.
export default {
	data() {
		return {}
	},
	mounted() {},
	computed: {
		backgroundColor() {
			return this.mergedStyle[this.widget.props.background_color]
		},
		style() {
			return {
				background: this.backgroundColor
			}
		},
		imageUrl: function() {
			return "/mediafiles/" + this.widget.props.image
		}
	},
	methods: {}
}
