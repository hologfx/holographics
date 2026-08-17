const fs = require("fs-extra")
const path = require("path")
const fileType = require("file-type")
const EventEmitter = require("events").EventEmitter

class BaseDirFileModel extends EventEmitter {
	constructor(filename, dir, options = {}) {
		super()
		// Validations
		if (!filename) throw new Error("Must provide filename")
		if (!dir) throw new Error("Must provide dir")
		const { contents, textfiles } = options

		// Assignments
		this.filename = filename
		this.dir = dir

		try {
			this.contents = contents || fs.readFileSync(this.filePath)
			if (textfiles) {
				this.contents = this.contents.toString()
			} else {
				this.contents = undefined
			}
			try {
				this.filetype = fileType(fs.readFileSync(this.filePath)) || {}
			} catch (e) {}
		} catch (e) {}
	}

	get filePath() {
		return path.join(this.dir, this.filename)
	}

	save(contents) {
		this.contents = contents || this.contents
		fs.writeFileSync(this.filePath, this.contents)
		return this
	}

	delete() {
		fs.unlinkSync(this.filePath)
		return this
	}

	static new(filename, filepath, contents) {
		return new this(filename, filepath, contents).save()
	}
}

module.exports = BaseDirFileModel
