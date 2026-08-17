import EventEmitter from "events"

class Timer extends EventEmitter {
	constructor(ms) {
		super()
		this.ms = ms
	}

	get hasFinished() {
		if (!this.lastChange) return false
		return Date.now() - this.lastChange < this.ms
	}

	update() {
		this.lastChange = Date.now()
		clearTimeout(this.timer)
		this.timer = setTimeout(() => {
			this.emit("timer-finished")
		}, this.ms)
	}
}

export { Timer }
