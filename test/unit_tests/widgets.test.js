const scaffold = require("../test_scaffold")

const db = scaffold.db

describe("widgets", function() {
	before(function(done) {
		scaffold.db_default_state()
		scaffold.create_a_widget()
		done()
	})
	after(scaffold.restore_db_state)

	it(".all() returns all widgets", function(done) {
		expect(Widget.all()).to.be.an("array")
		expect(Widget.all()[0].constructor.name).to.equal("Widget")
		done()
	})

	context("dealing with a widget", function() {
		let broadcastMessage
		before(async function() {
			broadcastMessage = await scaffold.create_a_widget()
		})

		it("creates a new widget", function(done) {
			expect(broadcastMessage).to.have.property("id")
			expect(broadcastMessage).to.have.property("name")
			expect(broadcastMessage).to.have.property("props")
			expect(
				db
					.get("widgets")
					.find({ id: broadcastMessage.id })
					.value().type
			).to.equal("BroadcastMessage")
			done()
		})

		it("updates a widget", function(done) {
			broadcastMessage.update({
				props: { visibility: true }
			})

			expect(broadcastMessage.props.visibility).to.equal(true)
			expect(
				db
					.get("widgets")
					.find({ id: broadcastMessage.id })
					.value().props.visibility
			).to.equal(true)
			done()
		})

		// it ('runs a widget action', function(done) {
		//   let countdownWidget = Widget.create({ type: 'Countdown' });
		//   countdownWidget.runMethod('pauseresume')
		//   expect(countdownWidget.props.running).to.equal(false)
		//   done()
		// })

		it("deletes a widget", function(done) {
			broadcastMessage.remove()
			db.read()
			expect(
				db
					.get("widgets")
					.find({ id: broadcastMessage.id })
					.value()
			).to.equal(undefined)
			done()
		})

		it("returns merged widget style", function(done) {
			expect(broadcastMessage.mergedStyle).to.be.an("object")
			expect(broadcastMessage.mergedStyle).to.include.property("visibility")
			done()
		})
	})

	context("multiple widgets with properties", function() {
		let clock1, clock2

		before(function() {
			clock1 = Widget.create({ type: "Clock" })
			clock2 = Widget.create({ type: "Clock" })
		})

		it("multiple widgets have different ids", function() {
			expect(clock1.id).to.not.equal(clock2.id)
		})

		it("can set properties on different widgets of same type seperately", function() {
			clock1.patch({
				props: {
					timeformat: "24H"
				}
			})
			expect(clock1.props.timeformat).to.equal("24H")
			expect(clock2.props.timeformat).to.equal("12H")
		})
	})
})
