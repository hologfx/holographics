function validate(status) {
	expect(status).to.have.property("filename")
	expect(status).to.have.property("filetype")
}

module.exports = {
	async get(adapter) {
		const res = await adapter()
		validate(res[0])
	}
}
