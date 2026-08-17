// Receives the widget, widgetModule and entries as props.
export default {
	computed: {
		videoUrl: function() {
			return "/mediafiles/" + this.widget.props.video
		}
	}
}
