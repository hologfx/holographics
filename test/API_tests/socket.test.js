const scaffold = require("../test_scaffold")

const Service = require("../../src/server/services")
const transport = require("../../src/server/transports/socket.io")

const io = require("socket.io-client")
const socketClient = io.connect(scaffold.baseUrl)

const serviceTests = {}

Service.list.forEach(service => {
	const name = service.name.toLowerCase()

	describe(`${name} socket API`, function() {
		before(scaffold.db_default_state)
		after(scaffold.restore_db_state)

		try {
			serviceTests[name] = require(`./services/${name}`)
		} catch (e) {
			console.log(`No socket.io tests provided for ${name}`)
		}

		// Time required for server startup
		this.timeout(5000)

		// For every method on our service, setup a test
		Object.values(service.methods).forEach(method => {
			const eventName = `${transport.eventName(method, service)}`

			// Setup the reverse adapter that will interface with our server (using Express)
			const adapter = function({ id, data } = {}) {
				return new Promise((resolve, reject) => {
					socketClient.emit(eventName, { id, data }, response => {
						resolve(response)
					})
				})
			}

			// Finally we can get around to TESTING
			// If a serviceTest exists for this service and method
			if (serviceTests[name] && serviceTests[name][method.name]) {
				// Create the test
				it(eventName, async function() {
					await serviceTests[name][method.name](adapter)
				})
			} else {
				// Or if we don't have a test yet, create it as a pending test
				it(eventName)
			}
		})
	})
})
