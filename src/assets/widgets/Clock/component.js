// Receives the widget, widgetModule and entries as props.
export default {
	data() {
		return {
			currentTime: "00:00:00"
		}
	},
	mounted() {
		this.setTime()
		this.$nextTick(() => {
			this.setTime()
		})
	},
	sockets: {
		stateChanged() {
			this.$nextTick(() => {
				this.setTime()
			})
		}
	},
	methods: {
		setTime: function() {
			if (this.widget.props.timeformat === "12H")
				this.$set(this, "currentTime", moment().format("hh:mm:ss A"))
			if (this.widget.props.timeformat === "24H")
				this.$set(this, "currentTime", moment().format("HH:mm:ss"))

			setTimeout(this.setTime, 500)
		}
	}
}
