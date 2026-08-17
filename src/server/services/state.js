const state = require("../lib/state")

module.exports = {
	emitter: state,
	events: {
		stateChanged(result) {
			return result
		}
	},
	get() {
		return state.get()
	},
	update(data) {
		return state.set(data)
	},
	patch(data) {
		return state.update(data)
	},
	remove() {
		return state.reset()
	}
}
