const OutputModule = require("../models/OutputModule")

module.exports = {
  emitter: OutputModule.prototype,
	events: {
		outputmodulesChanged(result) {
			return result
		}
	},
	get() {
		return OutputModule.all
	}
}
