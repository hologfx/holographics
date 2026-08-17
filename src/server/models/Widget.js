const state = require("../lib/state")
const { InvalidInputError } = require("../lib/errors")
const { Logger } = require("../lib/logging")
const logging = new Logger("models/Widgets")

// Models
const BaseDBModel = require("./BaseDBModel")

class Widget extends BaseDBModel {
	constructor(values) {
		if (typeof values !== "object")
			throw new Error("Must provide values object")
		if (!values.type) throw new Error("Must set widget type")
		if (!WidgetModule.findBySlug(values.type))
			throw new Error("That widget type does not exist")

		values.name = values.name || ""
		values.style = values.style || {}
		values.has_many = [Entry]
		values.persistKeys = ["type", "name", "style", "props"]

		super(values)
		this.props = Object.assign(
			{},
			this.widgetModule.default.props,
			this.props,
			values.props
		)
	}

	get widgetModule() {
		return WidgetModule.findBySlug(this.type)
	}

	get mergedStyle() {
		return Object.assign(
			{
				type: this.type,
				id: this.id,
				widget_wrapping: true,
				...this.props
			},
			state.get().style,
			this.widgetModule.default.style || {},
			this.style
		)
	}

	runMethod(method, params = {}) {
		try {
			return this.widgetModule.methods[method].call(this, params)
		} catch (e) {
			logging.error(`Running ${this.type} method failed: ${e.message}`)
		}
	}

	removeStyleKey(key) {
		this.style[key] = undefined
		this.save()
	}

	setVisibility(visibility) {
		if (this.widgetModule.hasEntries) {
			if (visibility === true && this.entries.length === 0)
				throw new InvalidInputError("You need to add an entry first")
			if (this.widgetModule.multipleActiveEntries || !visibility) {
				this.entries.forEach(entry => entry.patch({ visibility }))
			} else {
				this.entries[0].patch({ visibility })
			}
		} else {
			this.patch({ props: { visibility } })
		}
		return this
	}
}

module.exports = Widget
