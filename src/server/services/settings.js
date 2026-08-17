const settings = require("../lib/settings")
const updates = require("../lib/updates")
const { ApplicationLog } = require("../lib/logging")

module.exports = {
	get() {
		return settings.read().value()
	},
	patch(data) {
		settings.merge(data).write()
		const newSettings = settings.read().value()
		updates.channel = newSettings.updates.channel
		ApplicationLog.setLevel(newSettings.logging.level)
		return newSettings
	}
}
