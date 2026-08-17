function validate(widgetModule) {
	expect(widgetModule).to.have.property("name")
	expect(widgetModule).to.have.property("description")
	expect(widgetModule).to.have.property("hasEntries")
	expect(widgetModule).to.have.property("multipleActiveEntries")
	expect(widgetModule).to.have.property("icon")
}

module.exports = {
	async get(adapter) {
		const res = await adapter()
		validate(res[0])
	},
	async refresh(adapter) {
		const res = await adapter()
		validate(res[0])
	}
}
