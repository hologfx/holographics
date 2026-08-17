// Receives the widget, widgetModule and entries as props.
export default {
	computed: {
		imageUrl: function() {
			return "/mediafiles/" + this.widget.props.image
		}
	}
}
