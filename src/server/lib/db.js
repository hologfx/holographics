const low = require("lowdb")
const lodashId = require("lodash-id")
const FileSync = require("lowdb/adapters/FileSync")
const path = require("path")

const DBFile = path.join(user_data_dir, "db.json")
const adapter = new FileSync(DBFile)

const db = low(adapter)

db._.mixin(lodashId)

db.setDefaults = function() {
	db.defaultsDeep({
		style: {
			activeTheme: "default.styl",
			primary_color: "rgb(69, 151, 251)",
			secondary_color: "rgb(69, 151, 251)",
			background_a: "rgba(38, 38, 38, 0.9)",
			background_b: "rgba(79, 79, 79, 0.9)",
			text_a: "rgb(219, 219, 219)",
			text_b: "rgb(0, 0, 0)",
			global_padding: "8",
			widget_padding: "2",
			widget_offset: "2",
			widget_repositioning: true,
			font_size: "3",
			canvas_bg: "rgba(255, 255, 255, 0)",
			enter_animation: "fade.js",
			enter_ease: "Expo",
			enter_duration: 700,
			leave_animation: "fade.js",
			leave_ease: "Expo",
			leave_duration: 700,
			reposition_ease: "Expo",
			reposition_duration: 700
		},
		widgets: [],
		entries: [],
		outputs: [],
		palettes: [],
		activePalette: []
	}).write()
}

db.setDefaults()

module.exports = db
