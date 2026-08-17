const scaffold = require("../test_scaffold")
const { API_URI } = scaffold

const Service = require("../../src/server/services")
const transport = require("../../src/server/transports/express")

const serviceTests = {}

Service.list.forEach(service => {
	const name = service.name.toLowerCase()

	describe(`${name} rest API`, function() {
		before(scaffold.db_default_state)
		after(scaffold.restore_db_state)

		try {
			serviceTests[name] = require(`./services/${name}`)
		} catch (e) {
			console.log(`No express tests provided for ${name}`)
		}

		// Time required for server startup
		this.timeout(5000)

		// For every method on our service, setup a test
		Object.values(service.methods).forEach(method => {
			// Get the method and route from our express transport adapter
			const restMethod = transport.restMethod(method)
			const route = transport.restRoute(method)
			const testName = `${restMethod.toUpperCase()} - ${name.toLowerCase()}${route}`

			// Setup the reverse adapter that will interface with our server (using Express)
			const adapter = async function({ id, data } = {}) {
				const url = `${API_URI}/${name.toLowerCase()}${route.replace(
					":id",
					id
				)}`
				// console.log(url)
				const result = await axios({
					method: restMethod,
					url,
					data,
					validateStatus: function(status) {
						return status < 500 // Reject only if the status code is greater than or equal to 500
					}
				})
				return result.data
			}

			// Finally we can get around to TESTING
			// If a serviceTest exists for this service and method
			if (serviceTests[name] && serviceTests[name][method.name]) {
				// Create the test
				it(testName, async function() {
					// Get the test helper corresponding to this service and method,
					// passing it the adapter and the serviceItem to work with
					await serviceTests[name][method.name](adapter)
				})
			} else {
				// Or if we don't have a test yet, create it as a pending test
				it(testName)
			}
		})
	})
})
