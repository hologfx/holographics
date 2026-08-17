function validate(status) {
	expect(status).to.have.property("ip")
	expect(status).to.have.property("version")
}

module.exports = {
	async get(adapter) {
		const res = await adapter()
		validate(res)
	}
}
