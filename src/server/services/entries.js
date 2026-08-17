module.exports = {
	find(data) {
		if (data && data.widgetId) {
			return Widget.findById(data.widgetId).entries
		} else {
			return Entry.all()
		}
	},
	create(data) {
		if (!data.widgetId) throw Error("Must provide widgetId")
		return Entry.create(data)
	},
	get(id) {
		return Entry.findById(id)
	},
	update(id, data) {
		return Entry.findById(id).update(data)
	},
	patch(id, data) {
		return Entry.findById(id).patch(data)
	},
	remove(id) {
		return Entry.findById(id).remove()
	}
}
