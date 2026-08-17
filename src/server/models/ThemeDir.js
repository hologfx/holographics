const fs = require("fs-extra")
const path = require("path")

// Models
const BaseDirModel = require("./BaseDirModel")
const Theme = require("./Theme")

class ThemeDirectory extends BaseDirModel {
	constructor() {
		super({ directory: "themes" })
	}

	processItem(filename, dirPath) {
		if (path.extname(filename).toLowerCase() === ".styl") {
			const fullpath = path.join(dirPath, filename)
			const contents = fs.readFileSync(fullpath).toString()
			return new Theme(filename, dirPath, contents)
		}
	}
}

const ThemeDir = new ThemeDirectory()

ThemeDir.on("directoryChanged", event => {
	ThemeDir.emit("themesChanged", ThemeDir.items)
})

module.exports = ThemeDir
