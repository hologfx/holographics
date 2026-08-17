const scaffold = require("../test_scaffold")

const db = scaffold.db

describe("entry model", function() {
	let widget
	before(async function() {
		scaffold.db_default_state()
		widget = await scaffold.create_a_widget()
	})
	after(scaffold.restore_db_state)

	it(".all returns all entries", function(done) {
		expect(Entry.all()).to.be.an("array")
		done()
	})

	it(".entries returns all entries on a widget", function(done) {
		expect(widget.entries).to.be.an("array")
		done()
	})

	context("manipulation", function() {
		let anEntry
		before(function(done) {
			anEntry = widget.create_entry({})
			done()
		})

		it("creates a new entry", function(done) {
			expect(anEntry).to.have.property("id")
			expect(anEntry).to.have.property("widgetId")
			done()
		})

		it("has parent accessor", function(done) {
			expect(anEntry.widget).to.have.property("type")
			done()
		})

		it("updates an entry", function(done) {
			anEntry.update({
				props: {
					name: "test"
				}
			})

			const dbResult = db
				.get("entries")
				.find({ id: anEntry.id })
				.value()

			expect(anEntry.props.name).to.equal("test")
			expect(dbResult.props.name).to.equal("test")
			done()
		})

		it("deletes an entry", function(done) {
			const removedEntry = anEntry.remove()
			expect(removedEntry.id).to.equal(anEntry.id)
			db.read()
			expect(
				db
					.get("entries")
					.find({ id: anEntry.id })
					.value()
			).to.equal(undefined)
			done()
		})
	})
})
