function validate(state) {
	expect(state).to.have.property("updates")
	expect(state).to.have.property("logging")
}

module.exports = {
	async get(adapter) {
		const res = await adapter()
		validate(res)
	},
	async patch(adapter) {
		const res = await adapter({
			data: {
				logging: {
					level: "debug"
				}
			}
		})
		expect(res.logging.level).to.equal("debug")
		validate(res)
	}
}
