const Output = require("../models/Output")

module.exports = {
	emitter: Output.prototype,
	events: {
		outputsChanged(result) {
			return result
		}
	},
	find() {
		return Output.all()
	},
	create(data) {
		return Output.create(data)
	},
	get(id) {
		return Output.findById(id)
	},
	update(id, data) {
		return Output.findById(id).update(data)
	},
	patch(id, data) {
		return Output.findById(id).patch(data)
	},
	remove(id) {
		return Output.findById(id).remove()
	},
	refresh(id) {
		return Output.findById(id).refresh()
	},
	renderFrames(id, data) {
		return Output.findById(id).renderFrames(data)
	},
	renderStream(id) {
		Output.findById(id).renderStream()
		return Output.findById(id).rendering
	},
	stopRender(id) {
		return Output.findById(id).stopRenderer()
	}
}
