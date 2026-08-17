require("source-map-support").install()
const path = require("path")
const fs = require("fs-extra")

// If we startup as an Electron app, these could already be set.
global.path_to_app = global.path_to_app || "./"
global.base_dir = global.base_dir || __dirname
global.user_data_dir = global.user_data_dir || "./user_data"

if (!global.appMode) {
	global.appMode = {
		environment: "node",
		packed: process.env.APP_ENV === "packed",
		development: !(process.env.NODE_ENV === "production")
	}
}

// In-case this is the absolute first startup, Electron hasn't made the user folders yet and we need to create them
// We add the ownership properties to counteract a strange Electron issue I found on the rainy afternoon of the 1st of November 2018
fs.ensureDirSync(user_data_dir, 0o2775)
fs.ensureDirSync(path.join(user_data_dir, "/themes"), 0o2775)
fs.ensureDirSync(path.join(user_data_dir, "/widgets"), 0o2775)
fs.ensureDirSync(path.join(user_data_dir, "/mediafiles"), 0o2775)
fs.ensureDirSync(path.join(user_data_dir, "/animations"), 0o2775)

const server = require("./server/")

server.startHolographics()

module.exports = server
