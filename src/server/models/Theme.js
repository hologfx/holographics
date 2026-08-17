const state = require("../lib/state")
const stylus = require("stylus")
const path = require("path")
const fs = require("fs")

// Models
const BaseDirFileModel = require("./BaseDirFileModel")

class Theme extends BaseDirFileModel {
	constructor(filename, dir, contents) {
		super(filename, dir, { contents, textfiles: true })

		// Assignments
		this.originality = this.isAppTheme
		this.variables = this.getVariables()

		const render = Theme.render(this.contents)
		this.rendered = render.css
		this.error = render.error
	}

	get isAppTheme() {
		let appTheme = ""
		try {
			appTheme = fs
				.readFileSync(path.join(base_dir, "/assets/themes", this.filename))
				.toString()
		} catch (e) {}
		const userTheme = this.contents

		return {
			modified: appTheme !== userTheme,
			default: appTheme !== ""
		}
	}

	getVariables() {
		const variables = {}
		try {
			const split = this.contents.split("=")
			if (split.length <= 1) return {}

			let i
			for (i = 0; i < split.length / 2; i++) {
				try {
					const key = split[0 + i].split("// ")[1]
					const value = split[1 + i].split('"')[1].split('"')[0]
					variables[key] = value
				} catch (e) {
					// Not a variable
				}
			}
		} catch (e) {}

		return variables
	}

	save() {
		super.save()
		this.originality = this.isAppTheme
		this.variables = this.getVariables()
		return this
	}

	delete() {
		super.delete()
		ThemeDir.populateUserDir()
		ThemeDir.loadAllFromDisk()
		return this
	}

	updateRender() {
		// Triggered if active theme every state change
		// Checks if style variables have changed, if this is the case, re-render theme
		if (
			!this.last_style ||
			JSON.stringify(this.last_style) !== JSON.stringify(state.get().style)
		) {
			this.last_style = state.get().style
			const render = Theme.render(this.contents)
			this.rendered = render.css
			this.error = render.error
			ThemeDir.emit("themesChanged", ThemeDir.all)
		}
	}

	static render(contents) {
		const renderString = contents
		// logging.log(`RENDERING ${options.path_to_file ? options.path_to_file : 'string'}`, { type: logging.TYPES.INFO, level: logging.LEVELS.HIGH });

		const options = {}
		options.globals = {}

		Object.entries(state.get().style).forEach(
			([key, value]) =>
				(options.globals[`$${key}`] = stylus.utils.parseString(value))
		)

		let css, error
		stylus.render(renderString, options, (err, result) => {
			if (err) error = err
			else css = result
		})

		return { css, error }
	}
}

module.exports = Theme
