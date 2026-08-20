const { EventEmitter } = require("events")
const status = require("./status")
const { Logger } = require("../lib/logging")
const logging = new Logger("lib/updates")
const settings = require("../lib/settings")

var updater = {}

// In development, either mode, we mock receiving updates
if (appMode.development) {
	updater = new EventEmitter()

	let downloadProgress = {
		total: 72365340,
		delta: 10993318,
		transferred: 0,
		percent: 0,
		bytesPerSecond: 20746944
	}

	const updateInfo = {
		version: "1.0.0-alpha.4",
		files: [
			{
				url: "Holographics-1.0.0-alpha.4-mac.zip",
				sha512:
					"tVyUsLlWLf36gmTV8rUoFpRv2V0kKl4hwrX6Vs4QlnZbMf/EvLe6exdVTz3Qk1sps/ewrTB+OVeNRaZh7PcG1w==",
				size: 72363277,
				blockMapSize: 76736
			},
			{
				url: "Holographics-1.0.0-alpha.4.dmg",
				sha512:
					"bgH31d1YFLUZly8XYYGIrDqIJeVp96EMuj378Oi56VIWxe1eIAeZl+iT6UCLLQEYgBkPEGQZh7NfoCrjSZAXNQ==",
				size: 72302659
			}
		],
		path: "Holographics-1.0.0-alpha.4-mac.zip",
		sha512:
			"tVyUsLlWLf36gmTV8rUoFpRv2V0kKl4hwrX6Vs4QlnZbMf/EvLe6exdVTz3Qk1sps/ewrTB+OVeNRaZh7PcG1w==",
		releaseNotes:
			'# 1.0.0-alpha.8 <span class=\'date\'>2019-1-1</span>\n\n## Update title\n\nUpdate description\n\n\n# 1.0.0-alpha.7 <span class=\'date\'>2019-1-1</span>\n\n## Update title\n\n### CHANGED\n<ul class="CHANGED">\n<li><span class="type CHANGED">CHANGED</span>Release process</li>\n</ul>\n\n\n# 1.0.0-alpha.6 <span class=\'date\'>2019-1-1</span>\n\n## Update item\n\nLine 2\n\n### FEATURE\n<ul class="FEATURE">\n<li><span class="type FEATURE">FEATURE</span>Update item</li>\n</ul>\n\n### CHANGED\n<ul class="CHANGED">\n<li><span class="type CHANGED">CHANGED</span>Update item</li>\n</ul>\n\n### BREAKING CHANGE\n<ul class="BREAKING CHANGE">\n<li><span class="type BREAKING CHANGE">BREAKING CHANGE</span>Update item</li>\n</ul>\n\n\n',
		releaseDate: "2019-02-01T12:42:28.247Z"
	}

	updater.checkForUpdates = () => {
		updater.emit("checking-for-update")
		setTimeout(() => {
			const available = Math.random() < 0.5
			const error = Math.random() < 0.01
			if (error) {
				updater.emit("error")
				return
			}
			if (available) {
				updater.emit("update-available", updateInfo)
				logging.log("Update is available", { type: logging.TYPES.WARNING })
			} else {
				updater.emit("update-not-available", updateInfo)
				logging.log("Already up-to-date", { type: logging.TYPES.SUCCESS })
			}
		}, 500)
	}

	updater.downloadProgressor = () => {
		// Create logical progression values
		downloadProgress.percent = downloadProgress.percent + 4
		downloadProgress.transferred =
			downloadProgress.total * (downloadProgress.percent / 100)
		downloadProgress.bytesPerSecond =
			downloadProgress.bytesPerSecond * (Math.random() * (1.1 - 0.9) + 0.9)

		if (downloadProgress.percent > 100) {
			updater.emit("update-downloaded", updateInfo)
			return
		}
		updater.emit("download-progress", downloadProgress)
		if (!updater.shouldCancelDownload) {
			setTimeout(updater.downloadProgressor, 500)
		} else {
			logging.log("Cancelled update download", { type: logging.TYPES.ERROR })
			updater.shouldCancelDownload = false
		}
	}

	updater.downloadUpdate = () => {
		return new Promise((resolve, reject) => {
			// Reset downloadProgress
			downloadProgress = {
				total: 72365340,
				delta: 10993318,
				transferred: 0,
				percent: 0,
				bytesPerSecond: 20746944
			}
			// Resolve with object that has the cancellation feature
			resolve({
				cancel: () => {
					updater.shouldCancelDownload = true
				}
			})
			// Now start the download progressor function
			updater.downloadProgressor()
		})
	}

	updater.quitAndInstall = () => {
		logging.log("Update installed", { type: logging.TYPES.SUCCESS })
	}
}

// In production, environment 'node', disable updates
if (appMode.development && appMode.environment === "node") {
	updater.disabled = true
}

// In production, environment 'electron', use actual updates
if (appMode.environment === "electron" && !appMode.development) {
	updater = require("electron-updater").autoUpdater
	updater.logger = console
	updater.autoDownload = false
	updater.autoInstallOnAppQuit = false
	updater.allowDowngrade = true
	updater.currentVersion = status.get().version
}

updater.setChannel = channel => {
	updater.channel = channel === "alpha" ? "beta" : channel
	updater.allowPrerelease = updater.channel !== "latest"
}

updater.setChannel(settings.read().value().updates.channel)

module.exports = updater
