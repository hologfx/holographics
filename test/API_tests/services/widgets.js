function validate(widget) {
	expect(widget).to.have.property("id")
	expect(widget).to.have.property("name")
	expect(widget).to.have.property("props")
}

function giveWidget() {
	return Widget.create({ type: WidgetModuleDir.items[0].slug })
}

module.exports = {
	async find(adapter) {
		const res = await adapter()
		expect(res).to.be.an("array")
	},
	async create(adapter) {
		const res = await adapter({
			data: {
				type: "Clock"
			}
		})
		validate(res)
	},
	async get(adapter) {
		const res = await adapter({
			id: giveWidget().id
		})
		validate(res)
	},
	async update(adapter) {
		const res = await adapter({
			id: giveWidget().id,
			data: {
				name: "Hello world"
			}
		})
		validate(res)
		expect(res.name).to.equal("Hello world")
	},
	async patch(adapter) {
		const res = await adapter({
			id: giveWidget().id,
			data: {
				name: "Hello world 2"
			}
		})
		validate(res)
		expect(res.name).to.equal("Hello world 2")
	},
	async remove(adapter) {
		const widget = giveWidget()
		const res = await adapter({
			id: widget.id
		})
		validate(res)
		expect(res.id).to.equal(widget.id)
	},
	async toggle(adapter) {
		const widget = giveWidget()
		// A broadcast message must have an entry before it can be made visible
		const newEntry = widget.create_entry({})
		const res = await adapter({
			id: widget.id,
			data: {
				visibility: true
			}
		})

		validate(res)
		expect(Entry.findById(newEntry.id).visibility).to.equal(true)
	}
}
