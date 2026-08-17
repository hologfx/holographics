const scaffold = require("../test_scaffold")
const state = scaffold.state

describe("state", function() {
	before(scaffold.db_default_state)
	after(scaffold.restore_db_state)

	beforeEach(function() {
		state.update({ style: { activeTheme: "default.styl" } })
	})

	it("returns a state", function() {
		expect(state.get())
			.to.be.an("object")
			.that.has.property("style")
	})

	it("updates the state", function() {
		expect(
			state.update({
				style: { activeTheme: "3D.styl" }
			})
		)
			.to.be.an("object")
			.that.has.property("style")
	})

	it("saves state to a database file", function() {
		var activeTheme = state.get().style.activeTheme
		var file = JSON.parse(fs.readFileSync("./user_data/db.json")).style
			.activeTheme
		expect(file).to.equal(activeTheme)
	})

	it("will reset to defaults", function() {
		state.reset()
		expect(state.get().style.activeTheme).to.equal("default.styl")
		expect(state.get().style.primary_color).to.equal("rgb(69, 151, 251)")
	})

	context("is changed", function() {
		it("emits an event", function(done) {
			this.timeout(5000)
			state.once("stateChanged", function(state) {
				done()
			})
			state.update({ settings: { mode: "devdev" } })
		})
	})
})
