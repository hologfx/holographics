// Receives the widget, widgetModule and entries as props.
export default {
	computed: {
		solidColorStyle() {
			return {
				backgroundColor: this.widget.props.color
			}
		}
	}
}
