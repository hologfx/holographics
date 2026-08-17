const status = require("../lib/status")

module.exports = {
	emitter: status,
	events: {
		statusChanged(result) {
			return result
		}
	},
	get() {
		return status.get()
	}
}
