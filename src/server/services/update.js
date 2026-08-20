const updates = require("../lib/updates")
const settings = require("../lib/settings")
const { UpdateError } = require("../lib/errors")

module.exports = {
	emitter: updates,
	events: {
		"checking-for-update": () => {},
		"update-available": updateInfo => {
			return updateInfo
		},
		"update-not-available": updateInfo => {
			return updateInfo
		},
		"update-downloaded": updateInfo => {
			return updateInfo
		},
		"download-progress": downloadProgress => {
			return downloadProgress
		}
	},
	async get() {
		if (!appMode.development && appMode.environment !== "electron")
			throw Error("Can not update automatically in containerized mode")
		updates.setChannel(settings.get("updates").value().channel)

		const result = new Promise((resolve, reject) => {
			updates.once("error", updateInfo => {
				reject()
			})
			updates.once("update-not-available", updateInfo => {
				resolve({ newer: false, updateInfo })
			})
			updates.once("update-available", updateInfo => {
				resolve({ newer: true, updateInfo })
			})
		})

		try {
			updates.checkForUpdates()
		} catch (error) {}

		try {
			return await result
		} catch (e) {
			throw new UpdateError()
		}
	},
	async download() {
		if (!appMode.development && appMode.environment !== "electron")
			throw Error("Can not update automatically in containerized mode")

		const CancellationToken = require("electron-updater").CancellationToken
		updates.cancellationToken = new CancellationToken()
		updates.downloadUpdate(updates.cancellationToken)

		return updates.cancellationToken
	},
	cancelDownload() {
		if (!appMode.development && appMode.environment !== "electron")
			throw Error("Can not update automatically in containerized mode")
		if (updates.cancellationToken) updates.cancellationToken.cancel()
		return {}
	},
	install() {
		if (!appMode.development && appMode.environment !== "electron")
			throw Error("Can not update automatically in containerized mode")
		updates.quitAndInstall()
		return {}
	}
}
