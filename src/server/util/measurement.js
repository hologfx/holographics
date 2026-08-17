class Measurement {
	constructor(interval) {
		this.i = 0
		this.emitChange = 0
		this.interval = interval || 1

		this.startTime = new Date()
	}

	takeMeasurement() {
		this.i++
		this.emitChange++

		if (this.emitChange === this.interval) {
			let totalTime = new Date() - this.startTime
			totalTime /= 1000
			const period = totalTime / 100
			const hz = 1 / period
			this.startTime = new Date()
			this.emitChange = 0
			return { hz, i: this.i }
		}
		return { i: this.i }
	}
}

module.exports = Measurement
