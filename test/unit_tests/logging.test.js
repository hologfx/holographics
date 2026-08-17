const scaffold = require("../test_scaffold")

const {
	Logger,
	ApplicationLog,
	Events
} = require("../../src/server/lib/logging")

const logging = new Logger("test/unit/logging")

describe("logging", function() {
	before(function() {
		scaffold.db_default_state()
		ApplicationLog.prototype.history = []
	})
	after(scaffold.restore_db_state)

	it("initializes a new logger with 'testsuite' lib and path", function() {
		expect(logging.libPath).to.equal("test/unit/logging")
		expect(logging.lib).to.equal("logging")
	})

	it("has TYPES and LEVELS statically defined", function() {
		expect(logging.TYPES).to.be.an("object")
		expect(logging.LEVELS).to.be.an("object")
	})

	it("has low, medium and high logging levels", function() {
		expect(logging.LEVELS)
			.to.be.an("object")
			.with.property("LOW")
		expect(logging.LEVELS)
			.to.be.an("object")
			.with.property("MEDIUM")
		expect(logging.LEVELS)
			.to.be.an("object")
			.with.property("HIGH")
	})

	it("has default, info and error types", function() {
		expect(logging.TYPES)
			.to.be.an("object")
			.with.property("DEFAULT")
		expect(logging.TYPES)
			.to.be.an("object")
			.with.property("INFO")
		expect(logging.TYPES)
			.to.be.an("object")
			.with.property("ERROR")
	})

	it("has a full log history that keeps all messages", function() {
		expect(ApplicationLog.prototype.history).to.be.an("array")
		logging.log("Hello world")
		expect(ApplicationLog.prototype.history.length).to.equal(1)
	})

	context("with some log messages to filter from", function() {
		before(function() {
			logging.log("Low message 1", {
				level: logging.LEVELS.LOW,
				type: logging.TYPES.SUCCESS
			})
			logging.log("Low message 2", {
				level: logging.LEVELS.LOW,
				type: logging.TYPES.ERROR
			})
			logging.log("Low message 3", { level: logging.LEVELS.LOW })
			logging.log("Medium message 1", { level: logging.LEVELS.MEDIUM })
			logging.log("Medium message 2", { level: logging.LEVELS.MEDIUM })
			logging.log("High message 1", { level: logging.LEVELS.HIGH })
		})

		it("filters log messages by level", function() {
			const lowLogEntries = ApplicationLog.filterBy({
				level: logging.LEVELS.LOW
			})
			expect(lowLogEntries.length).to.equal(4)
			const mediumLogEntries = ApplicationLog.filterBy({
				level: logging.LEVELS.MEDIUM
			})
			expect(mediumLogEntries.length).to.equal(2)
		})

		it("filters log messages by type", function() {
			const successLogEntries = ApplicationLog.filterBy({
				type: logging.TYPES.SUCCESS
			})
			expect(successLogEntries.length).to.equal(1)
			expect(successLogEntries[0].msg).to.equal("Low message 1")
		})
	})

	describe("events", function() {
		it("emits an event when a new log entry is received", function(done) {
			Events.once("log", function(msg) {
				done()
			})
			logging.log("Success message!", {
				level: logging.LEVELS.LOW,
				type: logging.TYPES.SUCCESS
			})
		})
	})

	describe("logging levels", function() {
		it("will log any message with a level equal or lower than the set level", function() {
			ApplicationLog.setLevel(logging.LEVELS.LOW)
			expect(ApplicationLog.shouldLog(logging.LEVELS.LOW)).to.equal(true)
			expect(ApplicationLog.shouldLog(logging.LEVELS.MEDIUM)).to.equal(false)
			expect(ApplicationLog.shouldLog(logging.LEVELS.HIGH)).to.equal(false)
			ApplicationLog.setLevel(logging.LEVELS.MEDIUM)
			expect(ApplicationLog.shouldLog(logging.LEVELS.LOW)).to.equal(true)
			expect(ApplicationLog.shouldLog(logging.LEVELS.MEDIUM)).to.equal(true)
			expect(ApplicationLog.shouldLog(logging.LEVELS.HIGH)).to.equal(false)
			ApplicationLog.setLevel(logging.LEVELS.HIGH)
			expect(ApplicationLog.shouldLog(logging.LEVELS.LOW)).to.equal(true)
			expect(ApplicationLog.shouldLog(logging.LEVELS.MEDIUM)).to.equal(true)
			expect(ApplicationLog.shouldLog(logging.LEVELS.HIGH)).to.equal(true)
		})
	})
})
