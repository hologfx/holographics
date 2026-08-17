const { Logger } = require("../lib/logging")
const logging = new Logger("models/BaseDirModel")
const fs = require("fs-extra")
const path = require("path")
const EventEmitter = require("events").EventEmitter
const chokidar = require("chokidar")
const _ = require("lodash")
const crypto = require("crypto")
const settings = require("../lib/settings")

// Models
const BaseDirFileModel = require("./BaseDirFileModel")

class BaseDirModel extends EventEmitter {
	constructor(options) {
		super()

		// Validations
		if (!options.directory) throw new Error("Must provide directory")

		// Assignments
		this.directory = options.directory
		this.textfiles = options.textfiles || false
		this.dirs_as_items = options.dirs_as_items || false
		this.items = []
	}

	get defaultAssetFolderPath() {
		return path.join(base_dir, "/assets/", this.directory)
	}

	get userAssetFolderPath() {
		return path.join(user_data_dir, this.directory)
	}

	defaultAssetFilePath(filename) {
		return path.join(this.defaultAssetFolderPath, filename)
	}

	userAssetFilePath(filename) {
		return path.join(this.userAssetFolderPath, filename)
	}

	async getDirContents(dir) {
		// Read the contents of the app directory from disk
		let dirContents = await fs.readdir(dir)

		// Filter out hidden files and folders
		dirContents = dirContents.filter(
			itemPath => !/(^|\/)\.[^\/\.]/g.test(itemPath)
		)

		// If model stipulates that dirs are items, filter only dirs
		if (this.dirs_as_items) {
			const filteredDirs = []
			const dirStatsPromises = dirContents.map(itemPath => {
				return fs.stat(path.join(dir, itemPath))
			})
			const dirStats = await Promise.all(dirStatsPromises)

			dirStats.forEach((stat, index) => {
				if (stat.isDirectory())
					filteredDirs.push(dirContents[index] + "/index.js")
			})

			return filteredDirs
		}

		return dirContents
	}

	async populateUserDir(overwrite) {
		// Initiate loading of hashes file from disk
		const hashesFilePromise = fs.readFile(
			path.join(base_dir, "/assets/", "hashes.json")
		)

		// Initiate loading of default asset folder items from disk
		const defaultAssetFolderListPromise = this.getDirContents(
			this.defaultAssetFolderPath
		)

		// Initiate loading of user asset folder items from disk
		const userAssetFolderListPromise = this.getDirContents(
			this.userAssetFolderPath
		)

		// Await the completion of above drive operations
		const [
			hashesFile,
			defaultAssetFolderList,
			userAssetFolderList
		] = await Promise.all([
			hashesFilePromise,
			defaultAssetFolderListPromise,
			userAssetFolderListPromise
		])

		// Now load contents of all above files from default asset dir
		const defaultAssetFolderContentsPromise = defaultAssetFolderList.map(
			itemPath => {
				return fs.readFile(this.defaultAssetFilePath(itemPath))
			}
		)

		// Now load contents of all above from user dir
		const userAssetFolderContentsPromise = userAssetFolderList.map(itemPath => {
			return fs.readFile(this.userAssetFilePath(itemPath)).catch(er => {})
		})

		// Whilst disk operations are in progress, parse JSON from hashes file
		const hashes = JSON.parse(hashesFile)

		// Now wait until disk operations are finished
		const defaultAssetFolderContents = await Promise.all(
			defaultAssetFolderContentsPromise
		)
		const userAssetFolderContents = await Promise.all(
			userAssetFolderContentsPromise
		)

		const copyPromises = []
		defaultAssetFolderList.forEach((itemPath, index) => {
			const userAssetIndex = userAssetFolderList.indexOf(itemPath)
			const defaultFileBuffer = defaultAssetFolderContents[index]
			const userFileBuffer = userAssetFolderContents[userAssetIndex]

			// - If Overwrite is true or file does not exist,
			// skip all following steps and simply overwrite
			if (overwrite || userAssetFolderContents[userAssetIndex] === undefined) {
				if (this.dirs_as_items) {
					itemPath = itemPath.split("/index.js")[0]
				}
				logging.log(`Writing: ${itemPath}`, {
					type: logging.TYPES.WARNING,
					level: logging.LEVELS.LOW
				})
				copyPromises.push(
					fs.copy(
						this.defaultAssetFilePath(itemPath),
						this.userAssetFilePath(itemPath),
						{
							overwrite: true,
							errorOnExist: false
						}
					)
				)
				return
			}

			// - Go over list of default assets
			// - For every item, compare buffers for difference
			// - If different, check hashes list for clearance to overwrite
			// - If clear, overwrite

			// Return if files are equal
			if (defaultFileBuffer.equals(userFileBuffer)) {
				logging.log(`Files are equal, no need to overwrite: ${itemPath}`, {
					type: logging.TYPES.INFO,
					level: logging.LEVELS.HIGH
				})
				return
			}

			let userMD5 = ""
			try {
				userMD5 = crypto
					.createHash("md5")
					.update(userFileBuffer)
					.digest("hex")
			} catch (e) {}

			// Check if hash list offers clearance to overwrite
			if (!hashes.find(hash => userMD5 === hash.md5)) {
				logging.log(`File modified by user, do not overwrite`, {
					type: logging.TYPES.INFO,
					level: logging.LEVELS.HIGH
				})
				return
			}

			if (this.dirs_as_items) {
				itemPath = itemPath.split("/index.js")[0]
			}
			// Add to overwrite list
			logging.log(`Overwriting: ${itemPath} with MD5: ${userMD5}`, {
				type: logging.TYPES.INFO,
				level: logging.LEVELS.HIGH
			})
			copyPromises.push(
				fs.copy(
					this.defaultAssetFilePath(itemPath),
					this.userAssetFilePath(itemPath),
					{
						overwrite: true,
						errorOnExist: false
					}
				)
			)
		})
		return Promise.all(copyPromises)
	}

	/**
	 * Loads the contents of the directory provided, piping each item through a processor function
	 *
	 * @returns Array of processed items
	 * @memberof BaseDirModel
	 */
	async loadAllFromDisk() {
		// Read the contents of the directory from disk
		const dirPath =
			settings.read().value().assetsFolder === "SOURCE"
				? this.defaultAssetFolderPath
				: this.userAssetFolderPath

		logging.log(`Reading from ${dirPath}`, {
			type: logging.TYPES.INFO,
			level: logging.LEVELS.MEDIUM
		})
		let dirContents = await this.getDirContents(dirPath)

		// Filter out all hidden files and folders from the result
		dirContents = dirContents.filter(
			itemPath => !/(^|\/)\.[^\/\.]/g.test(itemPath)
		)

		const items = []
		dirContents.forEach(itemPath => {
			const item = this.processItem(itemPath, dirPath)
			if (item) items.push(item)
		})
		this.items = items

		return items
	}

	/**
	 * Transforms the item provided for inclusion in the array
	 *
	 * @param {string} item
	 * @returns Object with the processed item
	 * @memberof BaseDirModel
	 */
	processItem(filename, dirPath) {
		return new BaseDirFileModel(filename, dirPath, {
			textfiles: this.textfiles
		})
	}

	async all() {
		if (this.items.length > 0) return this.items
		return this.loadAllFromDisk()
	}

	async findByFilename(filename) {
		const items = await this.all()
		return items.find(f => f.filename === filename)
	}
}

module.exports = BaseDirModel
