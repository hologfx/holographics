function validate(status) {
	expect(status).to.have.property("newer")
	expect(status).to.have.property("updateInfo")
}

module.exports = {
	async get(adapter) {
		const res = await adapter()
		validate(res)
	},
	async download(adapter) {
		const res = await adapter()
		expect(res).to.not.have.property("code")
	},
	async cancel(adapter) {
		const res = await adapter()
		expect(res).to.not.have.property("code")
	},
	async install(adapter) {
		const res = await adapter()
		expect(res).to.not.have.property("code")
	}
}
