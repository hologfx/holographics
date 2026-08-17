const Errors = require("../lib/errors")
const { Logger } = require("../lib/logging")
const logging = new Logger("transports/socket.io")
const { getArgs, filterResponseObject } = require("./util")

const transport = function(io) {
	transport.io = io

	logging.log("SOCKET API loaded", { type: logging.TYPES.SUCCESS })

	transport.io.on("connection", socket => {
		// On connection, scaffold event handlers
		transport.services.forEach(service => {
			// Setup handlers for all methods
			Object.values(service.methods).forEach(method => {
				const eventName = transport.eventName(method, service)

				socket.on(eventName, ({ id, data } = {}, response) => {
					logging.log(
						`Handling ${eventName} with ${JSON.stringify({ id, data })}`,
						{ type: logging.TYPES.DEFAULT, level: logging.LEVELS.MEDIUM }
					)
					const callerArgs = []
					if (id !== undefined) callerArgs.push(id)
					if (data !== undefined) callerArgs.push(data)

					// We have this second try besides the promise/catch,
					// to handle certain error cases.
					try {
						Promise.resolve(method(...callerArgs))
							.then(result => {
								if (id !== undefined && !result && response) {
									response(new Errors.NotFoundError(service))
								} else if (response) {
									response(filterResponseObject(result))
								}
							})
							.catch(error => {
								transport.handleRequestError(response, error, service)
							})
					} catch (error) {
						transport.handleRequestError(response, error, service)
					}
				})
			})
		})
	})
	return transport
}

transport.handleRequestError = (response, error, service) => {
	if (response) {
		if (error instanceof Errors.ApplicationError) {
			// The error is already a wrapped ApplicationError, just return it
			response(error)
		} else {
			// Wrap the error in a ControllerError
			response(new Errors.ControllerError(service, error))
		}
	}
}

transport.serviceWillReceiveState = service => {
	return service.methods.get !== undefined || service.methods.find !== undefined
}

transport.eventName = (method, service) => {
	const serviceMethodArgs = getArgs(method)

	let serviceName = service.name

	// If the CREATE method
	if (method.name === "create") serviceName = service.singularname
	// If method has ID argument
	if (serviceMethodArgs.includes("id")) serviceName = service.singularname
	// If NOT one the standard methods
	if (
		!["find", "create", "get", "update", "patch", "remove"].includes(
			method.name
		)
	) {
		// Is there an ID provided
		if (serviceMethodArgs.includes("id")) serviceName = service.singularname
		// Is there Data provided
		if (serviceMethodArgs.includes("data")) serviceName = service.singularname
		// Is there a method named create? (this indicates a resource)
		if (Object.entries(service.methods).includes("create")) {
			serviceName = service.singularname
		}
	}

	return `${method.name}${serviceName}`
}

transport.services = []

transport.setup = service => {
	transport.services.push(service)

	if (transport.io) {
		// Setup event proxies
		if (service.events) {
			Object.keys(service.events).forEach(eventName => {
				if (service.emitter instanceof require("events")) {
					logging.log(`EVENT: ${eventName}`, {
						type: logging.TYPES.DEFAULT,
						level: logging.LEVELS.HIGH
					})
					service.emitter.on(eventName, data => {
						// This line prevents infinite loop for log entries
						if (eventName !== "log")
							logging.log(`Emitting ${eventName}`, {
								type: logging.TYPES.DEFAULT,
								level: logging.LEVELS.HIGH
							})
						// Emit the vent
						transport.io.emit(
							eventName,
							filterResponseObject(service.events[eventName](data))
						)
					})
				}
			})
		}
	}
}

module.exports = transport
