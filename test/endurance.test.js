const scaffold = require("./test_scaffold")
const { API_URI } = scaffold

const SDK = require("holographics-client-sdk")
Holographics = new SDK.Socket(API_URI)

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

describe("Endurance test", function() {
	before(scaffold.db_default_state)
	after(scaffold.restore_db_state)

	it("Can hide and show a widget 500 times", async function() {
		this.timeout(0)
		const newWidget = Widget.create({ type: "BroadcastMessage" })
		const newEntry = Entry.create({ widgetId: newWidget.id })

		let currentState = true
		for (let i = 0; i < 500; i++) {
			currentState = !currentState

			await Holographics.entries.update({
				id: newEntry.id,
				data: {
					visibility: currentState
				}
			})
			await timeout(2)
		}
		return true
	})
})
