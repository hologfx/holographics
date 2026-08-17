function validate(palette) {
	expect(palette).to.have.property("name")
	expect(palette).to.have.property("colors")
}

function givePalette() {
	return Palette.create({
		name: "Test palette",
		colors: ["#300030", "#480048", "#601848", "#c04848", "#f07241"]
	})
}

module.exports = {
	async find(adapter) {
		const res = await adapter()
		expect(res).to.be.an("array")
	},
	async create(adapter) {
		const res = await adapter({
			data: {
				name: "Test palette",
				colors: ["#300030", "#480048", "#601848", "#c04848", "#f07241"]
			}
		})
		validate(res)
	},
	async get(adapter) {
		const res = await adapter({
			id: givePalette().id
		})
		validate(res)
	},
	async update(adapter) {
		const res = await adapter({
			id: givePalette().id,
			data: {
				name: "Test palette 2",
				colors: ["#300030", "#480048", "#601848", "#c04848", "#f07241"]
			}
		})
		validate(res)
		expect(res.name).to.equal("Test palette 2")
	},
	async patch(adapter) {
		const res = await adapter({
			id: givePalette().id,
			data: {
				name: "Hello world 2"
			}
		})
		validate(res)
		expect(res.name).to.equal("Hello world 2")
	},
	async remove(adapter) {
		const palette = givePalette()
		const res = await adapter({
			id: palette.id
		})
		validate(res)
		expect(res.id).to.equal(palette.id)
	}
}
