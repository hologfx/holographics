require("../test_scaffold")

const expect = require("chai").expect
const path = require("path")
const fs = require("fs")

describe("themes", function() {
	it(".all returns an object with all themes", async function() {
		const themes = await ThemeDir.all()
		expect(themes).to.be.an("array")
		expect(themes[0]).to.include.all.keys([
			"filename",
			"filetype",
			"dir",
			"contents",
			"originality",
			"variables",
			"rendered",
			"error"
		])
	})

	it(".findByFilename(filename) returns contents of theme file", async function() {
		const themes = await ThemeDir.all()
		const theme = await ThemeDir.findByFilename(themes[0].filename)
		expect(theme.contents).to.be.an("string")
	})

	context("knows if a file", function() {
		let defaultThemeDir
		let userThemeDir
		let themes

		before(async function() {
			defaultThemeDir = path.join(base_dir, "/assets/themes")
			userThemeDir = path.join(user_data_dir, "/themes")

			// Default theme file
			fs.writeFileSync(
				path.join(defaultThemeDir, "defaulttheme.styl"),
				"// default theme"
			)
			fs.writeFileSync(
				path.join(userThemeDir, "defaulttheme.styl"),
				"// default theme"
			)
			// Modified theme file
			fs.writeFileSync(
				path.join(defaultThemeDir, "modifiedtheme.styl"),
				"// default theme"
			)
			fs.writeFileSync(
				path.join(userThemeDir, "modifiedtheme.styl"),
				"// modified theme"
			)

			// Custom theme file
			fs.writeFileSync(
				path.join(userThemeDir, "customtheme.styl"),
				"// custom theme"
			)

			await ThemeDir.loadAllFromDisk()
			themes = await ThemeDir.all()
		})

		after(function() {
			// Remove the whole shebang
			fs.unlinkSync(path.join(defaultThemeDir, "defaulttheme.styl"))
			fs.unlinkSync(path.join(userThemeDir, "defaulttheme.styl"))
			fs.unlinkSync(path.join(defaultThemeDir, "modifiedtheme.styl"))
			fs.unlinkSync(path.join(userThemeDir, "modifiedtheme.styl"))
			fs.unlinkSync(path.join(userThemeDir, "customtheme.styl"))
		})

		it("is a default theme", async function() {
			const defaulttheme = await ThemeDir.findByFilename("defaulttheme.styl")
			expect(defaulttheme.originality.default).to.equal(true)
		})

		it("is a modified theme", async function() {
			const modifiedtheme = await ThemeDir.findByFilename("modifiedtheme.styl")
			expect(modifiedtheme.originality.modified).to.equal(true)
		})

		it("is a custom theme", async function() {
			const customtheme = await ThemeDir.findByFilename("customtheme.styl")
			expect(customtheme.originality.default).to.equal(false)
		})
	})
})
