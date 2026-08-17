require("../test_scaffold")

global.appMode = {
	environment: "node",
	packed: false,
	development: true
}

const updater = require("../../src/server/lib/updates")

describe("mocked updater", function() {
	context("checking for update", function() {
		const updateEvents = {
			checking: false,
			available: false,
			notAvailable: false,
			error: false
		}
		before(function(done) {
			updater.on("checking-for-update", () => {
				updateEvents.checking = true
			})
			updater.on("update-not-available", () => {
				updateEvents.notAvailable = true
				done()
			})
			updater.on("update-available", () => {
				updateEvents.available = true
				done()
			})
			updater.on("error", () => {
				updateEvents.error = true
				done()
			})
			updater.checkForUpdates()
		})

		it("should emit checking event", function() {
			expect(updateEvents.checking).to.equal(true)
		})

		it("should indicate update available or update unavailable or errort", function() {
			expect(
				updateEvents.notAvailable ||
					updateEvents.available ||
					updateEvents.error
			).to.equal(true)
		})
	})
})
