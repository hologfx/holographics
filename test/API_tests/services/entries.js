function validate(entry) {
	expect(entry).to.have.property("id")
	expect(entry).to.have.property("props")
}

function giveWidget() {
	return Widget.create({ type: WidgetModuleDir.items[0].slug })
}

function giveEntry() {
	return giveWidget().create_entry({})
}

module.exports = {
	async find(adapter) {
		const res = await adapter()
		expect(res).to.be.an("array")
	},
	async create(adapter) {
		const res = await adapter({
			data: {
				widgetId: giveWidget().id
			}
		})
		validate(res)
	},
	async get(adapter) {
		const res = await adapter({
			id: giveEntry().id
		})
		validate(res)
	},
	async update(adapter) {
		const res = await adapter({
			id: giveEntry().id,
			data: {
				props: {
					hello: "world"
				}
			}
		})
		validate(res)
		expect(res.props.hello).to.equal("world")
	},
	async patch(adapter) {
		const res = await adapter({
			id: giveEntry().id,
			data: {
				props: {
					hello: "world2"
				}
			}
		})
		validate(res)
		expect(res.props.hello).to.equal("world2")
	},
	async remove(adapter) {
		const entry = giveEntry()
		const res = await adapter({
			id: entry.id
		})
		validate(res)
		expect(res.id).to.equal(entry.id)
	}
}
