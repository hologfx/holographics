function validate(theme) {
	expect(theme).to.include.keys([
		"filename",
		"filetype",
		"dir",
		"contents",
		"originality",
		"variables",
		"rendered"
	])
}

module.exports = {
	async find(adapter) {
		const res = await adapter()
		validate(res[0])
	},
	async get(adapter) {
		const res = await adapter({
			id: ThemeDir.items[0].filename
		})
		validate(res)
	},
	async update(adapter) {
		const res = await adapter({
			id: "default.styl",
			data: {
				contents: "// HELLO WORLD"
			}
		})
		expect(res.contents).to.equal("// HELLO WORLD")
		validate(res)
	},
	async remove(adapter) {
		const res = await adapter({
			id: "default.styl"
		})
		expect(res.contents).to.equal("// HELLO WORLD")
		validate(res)
	},
	async validate(adapter) {
		const res = await adapter({
			data: {
				contents: "// HELLO WORLD"
			}
		})
		expect(res.css).to.not.equal(undefined)
		expect(res.error).to.equal(undefined)
	}
}
