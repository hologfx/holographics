// Receives the widget, widgetModule and entries as props.
export default {
	data() {
		return {
			currentTime: moment()
		}
	},
	computed: {
		start() {
			return moment(this.widget.props.progressStart)
		},
		end() {
			return moment(this.widget.props.progressEnd)
		},
		totalTime() {
			return this.end.diff(this.start, "seconds")
		},
		progress() {
			const elapsed = this.currentTime.diff(this.start, "seconds")
			const progress = elapsed / this.totalTime
			// Clamp between 0 and 1
			if (this.widget.props.progressMethod === "manual") {
				return this.widget.props.progress / 100
			} else {
				return progress <= 0 ? 0 : progress >= 1 ? 1 : progress
			}
		},
		markers() {
			const markers = []
			this.visibleEntries.forEach(entry => {
				const time = moment(entry.props.time)
				const fromStart = time.diff(this.start, "seconds")
				const atProgress = fromStart / this.totalTime
				const past = this.progress > atProgress

				if (atProgress >= 0 && atProgress <= 1) {
					markers.push({
						name: entry.props.name,
						time,
						fromStart,
						atProgress,
						past
					})
				}
			})
			return markers
		}
	},
	mounted() {
		this.setTime()
	},
	methods: {
		setTime: function() {
			this.currentTime = moment()
			setTimeout(this.setTime, 500)
		}
	}
}
