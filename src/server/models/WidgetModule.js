class WidgetModule {
	constructor(values) {
		this.name = values.name || ""
		this.description = values.description || ""
		this.category = values.category || "Other"
		this.hasEntries = values.hasEntries || false
		this.multipleActiveEntries = values.multipleVisibleEntries || false
		this.selfPositioning = values.selfPositioning || false
		this.selfAnimating = values.selfAnimating || false
		this.selfWrapping = values.selfWrapping || false
		this.selfSizing = values.selfSizing || false
		this.icon = values.icon || ""
		this.default = values.default || {}
		this.style_presets = values.style_presets || []
		this.props = values.props || []
		this.entry_props = values.entry_props || []
		this.sidebar = values.sidebar || []
		this.methods = values.methods || {}
		this.actions = values.actions || {}
		this.vue_template = values.vue_template || ""
		this.include = values.include || ""
		this.css = values.css || ""
		this.slug = this.name.replace(/\s/g, "")
		this.error = values.error || ""

		if (values.vue_component) {
			let newVueComponent = values.vue_component.replace(
				`export default {`,
				`function widgetVueComponent() { return {`
			)
			newVueComponent += `} widgetVueComponent()`
			this.vue_component = newVueComponent
		} else {
			this.vue_component = ""
		}
	}

	static findBySlug(slug) {
		return WidgetModuleDir.items.find(w => w.slug === slug)
	}
}

module.exports = WidgetModule
