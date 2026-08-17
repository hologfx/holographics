const scaffold = require("../test_scaffold")

const Service = require("../../src/server/services")

const OSC = require("osc-js")
const osc = new OSC({ plugin: new OSC.DatagramPlugin() })

const serviceTests = {}

Service.list.forEach(service => {
	const name = service.name.toLowerCase()

	describe(`${name} OSC API`, function() {
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
			const OSCRoute = service.name.toLowerCase() + "/" + method.name
			if (!["find", "get", "update"].includes(method.name)) {
				// Setup the reverse adapter that will interface with our server
				const adapter = function({ id, data } = {}) {
					return new Promise((resolve, reject) => {
						const message = new OSC.Message(
							OSCRoute,
							JSON.stringify({ id, data })
						)
						osc.on(OSCRoute + "/#reply", response => {
							console.log(response)
						})
						osc.send(message, { port: 27015 })
					})
				}
				// Finally we can get around to TESTING
				// If a serviceTest exists for this service and method
				if (serviceTests[name] && serviceTests[name][method.name]) {
					// Create the test
					// it(OSCRoute, async function() {
					//   await serviceTests[name][method.name](adapter)
					// })
					it(OSCRoute)
				} else {
					it(OSCRoute)
					// Or if we don't have a test yet, create it as a pending test
				}
			}
		})
	})
})
