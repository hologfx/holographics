const models = [
	"BaseDBModel",
	"BaseDirFileModel",
	"BaseDirModel",
	"BaseMemoryModel",
	"Widget",
	"Entry",
	"Palette",
	"WidgetModule",
	"WidgetModuleDir",
	"MediaFile",
	"MediaFileDir",
	"Theme",
	"ThemeDir",
	"AnimationDir",
	"Animation",
	"OutputModule",
	"Output"
]

module.exports = {}
module.exports.all = {}
module.exports.models = models

module.exports.load = () => {
	models.forEach(model => {
		module.exports.all[model] = require(`./${model}`)
	})
}

module.exports.globalize = function() {
	module.exports.load()
	models.forEach(model => {
		global[model] = module.exports.all[model]
	})
}
