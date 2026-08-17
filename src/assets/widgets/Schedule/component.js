// Receives the widget, widgetModule and entries as props.
export default {
	data() {
		return {
			currentTime: moment()
		}
	},
	filters: {
		countdownFormat: function(value, format) {
			return moment.utc(value).format(format)
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
		events() {
			const events = []
			this.visibleEntries.forEach((entry, index) => {
				// Things we compute based on current time and event time
				const time = moment(entry.props.time)
				const timeToEventStart = time.diff(this.currentTime)
				const started = time < this.currentTime

				// Things we compute based on upcoming event
				let duration, nextEventTime, timeToEventEnd
				const nextEvent = this.visibleEntries[index + 1]
				if (nextEvent) {
					nextEventTime = moment(nextEvent.props.time)
					duration = nextEventTime.diff(time, this.widget.props.durationFormat)
					timeToEventEnd = nextEventTime.diff(this.currentTime)
				}

				const past = this.currentTime > nextEventTime

				if (this.widget.props.showPastEvents || !past) {
					events.push({
						name: entry.props.name,
						description: entry.props.description,
						time,
						duration,
						timeToEventStart,
						started,
						nextEventTime,
						timeToEventEnd,
						past
					})
				}
			})
			return events
		}
	},
	mounted() {
		this.setTime()
		console.log(this.markers)
	},
	methods: {
		setTime: function() {
			this.currentTime = moment()
			setTimeout(this.setTime, 500)
		}
	}
}
