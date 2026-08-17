const io = require("socket.io")()
const { Logger } = require("../lib/logging")
const logging = new Logger("lib/io")
const path = require("path")
let electron
try {
	electron = require("electron")
} catch (e) {}

io.on("connection", function(socket) {
	socket.on("open-dir", function(dir, outside_user_dir = false) {
		try {
			if (outside_user_dir) {
				electron.shell.openPath(dir)
			} else {
				electron.shell.openPath(path.join(user_data_dir, dir))
			}
		} catch (e) {
			logging.error(e.message)
		}
	})
	socket.on("pick-dir", function(data, response) {
		try {
			electron.dialog
				.showOpenDialog({
					properties: ["openDirectory"]
				})
				.then(result => {
					response(result)
				})
		} catch (e) {
			logging.error(e)
			response(e)
		}
	})
})

module.exports = io
