const fs = require("fs-extra")
const path = require("path")
const io = require("../lib/io")
const themes = require("../lib/themes")
const state = require("../lib/state")
const { Logger } = require("../lib/logging")
const logging = new Logger("controllers/reset")

io.on("connection", socket => {
	socket.on("reset_all", response => {
		logging.log("Full reset requested", { type: logging.TYPES.WARNING })
		fs.removeSync(user_data_dir)
		fs.ensureDirSync(user_data_dir, 0o2775)
		fs.ensureDirSync(path.join(user_data_dir, "/themes"), 0o2775)
		fs.ensureDirSync(path.join(user_data_dir, "/widgets"), 0o2775)
		fs.ensureDirSync(path.join(user_data_dir, "/mediafiles"), 0o2775)
		state.reset()
		setTimeout(() => {
			themes.reload()
			WidgetModule.reload({ force: true })
			MediaFile.reload()
		}, 500)
		response(true)
	})

	socket.on("reset_config", response => {
		response(state.reset())
	})

	socket.on("reset_themes", response => {
		response(themes.reload({ overwrite: true }))
	})

	socket.on("reset_widgetModules", response => {
		response(WidgetModule.reload({ overwrite: true, force: true }))
	})
})
