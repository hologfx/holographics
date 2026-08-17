// Receives the widget, widgetModule and entries as props.
export default {
	data() {
		return {
			titleBar: "lower_third.exe",
			notResponding: false
		}
	},
	mounted() {
		setTimeout(() => {
			const d = Math.random()
			if (d < 0.3) {
				this.titleBar = "lower_third.exe (not responding)"
				this.notResponding = true
			}
		}, 3000)
	}
}
