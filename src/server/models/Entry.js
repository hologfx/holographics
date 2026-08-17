// Models
const BaseDBModel = require("./BaseDBModel")

class Entry extends BaseDBModel {
	constructor(values) {
		if (typeof values !== "object")
			throw new Error("Must provide values object")
		values.props = values.props || {}
		values.visibility = values.visibility || false
		values.persistKeys = ["widgetId", "props", "visibility"]
		super(values)
	}

	get widget() {
		return Widget.findById(this.widgetId)
	}

	beforeSave() {
		if (this.visibility) this.validateVisibleEntries()
	}

	validateVisibleEntries() {
		// Sets other entries to be invisble if multipleActiveEntries is false
		if (!this.widget.widgetModule.multipleActiveEntries) {
			this.widget.entries.forEach(entry => {
				// Only if we're not dealing with the current entry
				if (entry.id !== this.id) {
					entry.visibility = false
					entry.save()
				}
			})
		}
	}
}

module.exports = Entry
