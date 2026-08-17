module.exports = {
	find() {
		return Widget.all()
	},
	create(data) {
		return Widget.create(data)
	},
	get(id) {
		return Widget.findById(id)
	},
	update(id, data) {
		return Widget.findById(id).update(data)
	},
	patch(id, data) {
		return Widget.findById(id).patch(data)
	},
	remove(id) {
		return Widget.findById(id).remove()
	},
	toggle(id, data) {
		const { visibility } = data
		return Widget.findById(id).setVisibility(visibility)
	}
}
