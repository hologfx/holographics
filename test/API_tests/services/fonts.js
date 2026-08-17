module.exports = {
	async get(adapter) {
		const res = await adapter()
		expect(res).to.be.an("array")
	}
}
