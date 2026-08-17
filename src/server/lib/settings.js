const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const path = require("path")

var DBFile = path.join(user_data_dir, "settings.json")

const adapter = new FileSync(DBFile)
const settings = low(adapter)

settings.setDefaults = function() {
	settings
		.defaultsDeep({
			port: "3000",
			logging: {
				level: "LOW"
			},
			updates: {
				channel: "latest"
			},
			window: {
				x: 200,
				y: 200,
				width: 1280,
				height: 800
			}
		})
		.write()
}

settings.setDefaults()

module.exports = settings
