const EventEmitter = require("events").EventEmitter

// Models
const MediaFileDir = require("./MediaFileDir")

class MediaFile extends EventEmitter {
	static async all() {
		return MediaFileDir.all()
	}

	static async findByFilename(filename) {
		return MediaFileDir.findByFilename(filename)
	}
}

MediaFileDir.on("directoryChanged", event => {
	MediaFile.prototype.emit("mediaFilesChanged", MediaFileDir.items)
})

module.exports = MediaFile
