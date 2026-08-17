const { Events } = require("../lib/logging")
const { ApplicationLog } = require("../lib/logging")

module.exports = {
	emitter: Events,
	events: {
		log(msg) {
			return msg
		}
	},
	get(data) {
		const limit = data.limit || 100
		delete data.limit
		const result = ApplicationLog.filterBy(data)
		return result.slice(Math.max(result.length - limit))
	}
}
