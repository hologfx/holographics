// Models
const AnimationDir = require("../models/AnimationDir")
const MediaFileDir = require("../models/MediaFileDir")
const ThemeDir = require("../models/ThemeDir")
const WidgetModuleDir = require("../models/WidgetModuleDir")
const allAssetModels = [AnimationDir, MediaFileDir, ThemeDir, WidgetModuleDir]

// Libs
const chokidar = require("chokidar")
const _ = require("lodash")
const { Logger } = require("../lib/logging")
const logging = new Logger("lib/assets")
const settings = require("../lib/settings")

const path = require("path")

class AssetManager {
	static async populateDefaults() {
		logging.log("Populating defaults")

		return Promise.all([
			AnimationDir.populateUserDir(false),
			MediaFileDir.populateUserDir(false),
			ThemeDir.populateUserDir(false),
			WidgetModuleDir.populateUserDir(false)
		])
	}

	static async readAll() {
		logging.log("Initializing asset models")
		return await Promise.all([
			AnimationDir.loadAllFromDisk(),
			MediaFileDir.loadAllFromDisk(),
			ThemeDir.loadAllFromDisk(),
			WidgetModuleDir.loadAllFromDisk()
		])
	}

	static async watchFiles() {
		if (this.prototype.watcher) {
			logging.log("Restarting file watchers")
			await this.prototype.watcher.close()
		} else {
			logging.log("Initializing file watchers")
		}

		const dirPath =
			settings.read().value().assetsFolder === "SOURCE"
				? path.join(base_dir, "/assets/")
				: user_data_dir
		const dirs = allAssetModels.map(m => path.join(dirPath, m.directory))

		this.prototype.watcher = chokidar.watch(dirs, {
			ignored: /(^|[\/\\])\../,
			ignoreInitial: true,
			awaitWriteFinish: false,
			persistent: true
		})

		allAssetModels.forEach(assetModel => {
			assetModel.emitDirChange = _.debounce(async () => {
				logging.log(`Changes detected in ${assetModel.directory} directory`)
				await assetModel.loadAllFromDisk()
				assetModel.emit("directoryChanged", assetModel.items)
			}, 100)
		})

		this.prototype.watcher.on("all", AssetManager.handleFileChange)
	}

	static handleFileChange(event, changedFilePath) {
		allAssetModels.forEach(assetModel => {
			if (changedFilePath.search(assetModel.directory) > 0) {
				assetModel.emitDirChange()
			}
		})
	}
}

module.exports = AssetManager
