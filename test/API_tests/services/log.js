module.exports = {
	async get(adapter) {
		const res = await adapter({ data: {} })
		expect(res).to.be.an("array")
	}
}
