// Receives the widget, widgetModule and entries as props.
export default {
	data() {
		return {
			counter: "",
			secondsRemaining: 60,
			target: moment()
		}
	},
	computed: {
		running() {
			return this.widget.props.running
		}
	},
	watch: {
		running: function(isRunning, wasRunning) {
			if (wasRunning && !isRunning) {
				this.secondsRemaining = this.target.diff(moment(), "seconds")
			}
			if (!wasRunning && isRunning) {
				this.setTarget()
				this.setCounter()
			}
		}
	},
	mounted() {
		this.secondsRemaining = Number(this.widget.props.seconds)
		this.setTarget()
		this.setCounter()
	},
	sockets: {
		state() {
			this.$nextTick(() => {
				if (this.running) this.setCounter()
			})
		}
	},
	methods: {
		setTarget: function() {
			if (this.widget.props.type === "timer") {
				this.target = moment().add(this.secondsRemaining, "s")
			} else {
				this.target = moment(this.widget.props.target)
			}
		},
		setCounter: function() {
			// Get the time between now and the target time
			var now = moment()

			if (now.isAfter(this.target) && this.widget.props.count_up) {
				var duration = moment.duration(now.diff(this.target))
			} else if (now.isAfter(this.target) && !this.widget.props.count_up) {
				var duration = moment.duration(0)
			} else {
				var duration = moment.duration(this.target.diff(now))
			}

			// Calculate parts
			var S = Math.floor((duration / 1000) % 60)
			var M = Math.floor((duration / 1000 / 60) % 60)
			var H = Math.floor((duration / (1000 * 60 * 60)) % 24)
			var D = Math.floor(duration / (1000 * 60 * 60 * 24))

			// Add leading zeroes
			var SS = S.toString().padStart(2, "0")
			var MM = M.toString().padStart(2, "0")
			var HH = H.toString().padStart(2, "0")
			var DD = D.toString().padStart(2, "0")

			function applyFormat(string) {
				string = string.replace("$DD", DD)
				string = string.replace("$HH", HH)
				string = string.replace("$MM", MM)
				string = string.replace("$SS", SS)
				string = string.replace("$D", D)
				string = string.replace("$H", H)
				string = string.replace("$M", M)
				string = string.replace("$S", S)
				return string
			}

			if (this.widget.props.format === "custom") {
				this.counter = applyFormat(this.widget.props.customformat)
			} else if (this.widget.props.format === "humanize") {
				if (now.isAfter(this.target) && !this.widget.props.count_up)
					this.counter = "now"
				else if (now.isAfter(this.target) && this.widget.props.count_up)
					this.counter = moment.duration(-duration).humanize(true)
				else this.counter = duration.humanize(true)
			} else {
				this.counter = applyFormat(this.widget.props.format)
			}

			if (!this.running) return
			setTimeout(this.setCounter, 500)
		}
	}
}
