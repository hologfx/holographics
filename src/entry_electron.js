const path = require("path")
const fs = require("fs-extra")
const { app } = require("electron")
app.disableHardwareAcceleration()

// Init electron
global.path_to_app = app.getAppPath()
global.base_dir = __dirname
global.user_data_dir = path.join(app.getPath("userData"), "/user_data")
global.appMode = {
	environment: "electron",
	packed: process.env.APP_ENV === "packed",
	development: require("electron-is-dev")
}

// In-case this is the absolute first startup, Electron hasn't made the user folders yet and we need to create them
// We add the ownership properties to counteract a strange Electron issue I found on the rainy afternoon of the 1st of November 2018
fs.ensureDirSync(app.getPath("userData"), 0o2775)
fs.ensureDirSync(user_data_dir, 0o2775)
fs.ensureDirSync(path.join(user_data_dir, "/themes"), 0o2775)
fs.ensureDirSync(path.join(user_data_dir, "/widgets"), 0o2775)
fs.ensureDirSync(path.join(user_data_dir, "/mediafiles"), 0o2775)
fs.ensureDirSync(path.join(user_data_dir, "/animations"), 0o2775)

global.electron = require("./electron/electron.js")

process.on("splashScreenUp", function() {
	if (process.env.APP_ENV === "packed") {
		__non_webpack_require__("./server.js")
	} else {
		const server = require("./server/")
		server.startHolographics()
	}
})
