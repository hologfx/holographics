var SystemFonts = require("system-font-families").default
var systemFonts = new SystemFonts()
const fonts = systemFonts.getFontsSync()

module.exports = {
	get() {
		return fonts
	}
}
