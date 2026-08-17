const MediaFile = require("../models/MediaFile")

module.exports = {
	emitter: MediaFile.prototype,
	events: {
		mediaFilesChanged(result) {
			return result
		}
	},
	get() {
		return MediaFile.all()
	}
}
