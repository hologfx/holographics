// const themes = require("../lib/themes");
const ThemeDir = require("../models/ThemeDir")

module.exports = {
	emitter: ThemeDir,
	events: {
		themesChanged(event) {
			return ThemeDir.items
		}
	},
	async find() {
		return await ThemeDir.all()
	},
	async get(id) {
		return await ThemeDir.findByFilename(id)
	},
	async update(id, data) {
		const { contents } = data

		const theme =
			(await ThemeDir.findByFilename(id)) ||
			new Theme(id, ThemeDir.userDirPath, contents)
		theme.contents = contents
		return theme.save()
	},
	async remove(id) {
		const theme = await ThemeDir.findByFilename(id)
		return theme.delete()
	},
	validate(data) {
		const { contents } = data
		return Theme.render(contents)
	},
	async reset() {
		await ThemeDir.populateUserDir(true)
		return await ThemeDir.all()
	}
}
