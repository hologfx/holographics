const { Logger } = require("../lib/logging")
const logging = new Logger("models/WidgetModuleDir")

const stylus = require("stylus")
const pug = require("pug")
const path = require("path")
const fs = require("fs")
const { NodeVM } = require("vm2")

// Models
const BaseDirModel = require("./BaseDirModel")
const WidgetModule = require("./WidgetModule")

class WidgetDirectory extends BaseDirModel {
	constructor(options) {
		super({
			directory: "widgets",
			dirs_as_items: true
		})
	}

	processItem(pathToIndex, dirPath) {
		const dir = pathToIndex.split("/index.js")[0]

		function helpers(dir) {
			return {
				renderPug: function (pugstring) {
					try {
						const htmlstring = pug.render(pugstring)
						return htmlstring
					} catch (e) {
						logging.log(`Error rendering ${dir} widget pug file: ${e}`, {
							type: logging.TYPES.ERROR,
							level: logging.LEVELS.LOW
						})
						logging.error(e)
						return ""
					}
				},
				renderStylus: function (string) {
					try {
						let css
						stylus.render(string, function (err, out) {
							if (err) throw err
							css = out
						})
						return css
					} catch (e) {
						logging.log(`Error rendering ${dir} widget stylus file: ${e}`, {
							type: logging.TYPES.ERROR,
							level: logging.LEVELS.LOW
						})
						logging.error(e)
						return ""
					}
				},
				getFile: function (filename) {
					try {
						// logging.log("Loading widget file: " + filename)
						const filecontents = fs.readFileSync(path.join(dir, filename))
						return filecontents
					} catch (e) {
						logging.log(
							`Error loading ${dir} widget file: ${filename} - ${e}`,
							{
								type: logging.TYPES.ERROR,
								level: logging.LEVELS.LOW
							}
						)
						logging.error(e)
						return ""
					}
				}
			}
		}

		const fullPath = path.join(dirPath, dir)

		const widgetSandbox = {
			...helpers(fullPath),
			widget: {}
		}
		let vm = new NodeVM({
			require: {
				external: true
			},
			sandbox: widgetSandbox
		})

		try {
			const script = fs.readFileSync(path.join(fullPath, "index.js")).toString()
			const result = vm.run(script)
			vm = null
			if (!result.name) throw Error("Invalid widget syntax")
			return new WidgetModule(result)
		} catch (error) {
			logging.error(error)
			logging.log("Error loading widget module: " + dir, {
				type: logging.TYPES.ERROR,
				level: logging.LEVELS.LOW
			})
			return new WidgetModule({
				name: dir,
				icon: "times",
				description: "An error occured loading this widget: " + error.message,
				error
			})
		}
	}
}

const WidgetModuleDir = new WidgetDirectory()

WidgetModuleDir.on("directoryChanged", event => {
	WidgetModuleDir.emit("widgetModulesChanged", WidgetModuleDir.items)
})

module.exports = WidgetModuleDir
