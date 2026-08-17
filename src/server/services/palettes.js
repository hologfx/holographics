module.exports = {
	find() {
		return Palette.all()
	},
	create(data) {
		return Palette.create(data)
	},
	get(id) {
		return Palette.findById(id)
	},
	update(id, data) {
		return Palette.findById(id).update(data)
	},
	patch(id, data) {
		return Palette.findById(id).update(data)
	},
	remove(id) {
		return Palette.findById(id).remove()
	}
}
