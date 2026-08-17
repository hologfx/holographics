const Errors = require("../lib/errors")
const { Logger } = require("../lib/logging")
const logging = new Logger("transports/osc")

const OSC = require("osc-js")
const osc = new OSC({ plugin: new OSC.DatagramPlugin() })

osc.on("open", () => {})

osc.open({ port: 27015 })

const transport = function() {
	logging.log("OSC API loaded", { type: logging.TYPES.SUCCESS })
	return transport
}

function handleControllerError(service, error) {
	return new Errors.ControllerError(service, error)
}

transport.setup = service => {
	Object.values(service.methods).forEach(method => {
		const OSCRoute = "/" + service.name.toLowerCase() + "/" + method.name

		// Ignore these methods since we can't send replies
		if (!["find", "get", "update"].includes(method.name)) {
			osc.on(OSCRoute, message => {
				const { id, data } = JSON.parse(message.args[0])

				const callerArgs = []
				if (id !== undefined) callerArgs.push(id)
				if (data !== undefined) callerArgs.push(data)

				logging.log(`Handling ${OSCRoute} with ${JSON.stringify({ id, data })}`)
				try {
					Promise.resolve(method(...callerArgs)).catch(error => {
						handleControllerError(service, error)
					})
				} catch (error) {
					handleControllerError(service, error)
				}
			})
		}
	})
}

module.exports = transport
