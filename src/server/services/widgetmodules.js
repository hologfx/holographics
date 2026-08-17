const WidgetModuleDir = require("../models/WidgetModuleDir")

module.exports = {
	emitter: WidgetModuleDir,
	events: {
		widgetModulesChanged(event) {
			return WidgetModuleDir.items
		}
	},
	async get() {
		return WidgetModuleDir.all()
	},
	async reset() {
		await WidgetModuleDir.populateUserDir(true)
		return await WidgetModuleDir.all()
	}
}
