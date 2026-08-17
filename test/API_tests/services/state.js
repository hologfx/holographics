function validate(state) {
	expect(state).to.have.property("style")
	expect(state).to.have.property("widgets")
	expect(state).to.have.property("entries")
	expect(state).to.have.property("palettes")
	expect(state).to.have.property("activePalette")
}

module.exports = {
	async get(adapter) {
		const res = await adapter()
		validate(res)
	},
	async update(adapter) {
		const res = await adapter({
			data: {
				style: {
					activeTheme: "clean.styl"
				}
			}
		})
		expect(res.style.activeTheme).to.equal("clean.styl")
		validate(res)
	},
	async patch(adapter) {
		const res = await adapter({
			data: {
				style: {
					activeTheme: "blocky.styl"
				}
			}
		})
		expect(res.style.activeTheme).to.equal("blocky.styl")
	},
	async remove(adapter) {
		const res = await adapter()
		expect(res.style.activeTheme).to.equal("default.styl")
		validate(res)
	}
}
