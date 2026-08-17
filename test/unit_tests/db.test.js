const scaffold = require("../test_scaffold")

describe("DB", function() {
	before(scaffold.db_default_state)
	after(scaffold.restore_db_state)

	it("should load defaults", function() {
		expect(scaffold.db.read().value()).to.have.property("style")
	})

	context("db file deleted from disk", function() {
		before(function() {
			fs.unlinkSync(`${global.user_data_dir}/db.json`)
			scaffold.db.setDefaults()
		})
		after(scaffold.restore_db_state)

		it("should re-write appropriate defaults", function() {
			var DBState = scaffold.db.read().value()
			expect(DBState.style.activeTheme).to.equal("default.styl")
			expect(DBState.style.primary_color).to.equal("rgb(69, 151, 251)")
		})
	})
})
