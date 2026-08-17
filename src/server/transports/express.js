const express = require("express")
const Errors = require("../lib/errors")
const { Logger } = require("../lib/logging")
const logging = new Logger("transports/express")

const { getArgs, filterResponseObject } = require("./util")

function handleControllerError(res, service, error) {
	const controllerError = new Errors.ControllerError(service, error)
	res.status(controllerError.code)
	res.json(controllerError)
}

function handleNotFoundError(res, service) {
	const error = new Errors.NotFoundError(service)
	res.status(error.code)
	res.json(error)
}

const transport = function(router) {
	logging.log("REST API loaded", { type: logging.TYPES.SUCCESS })
	transport.router = router
	return transport
}

transport.methodmap = {
	find: "get",
	create: "post",
	get: "get",
	update: "put",
	patch: "patch",
	remove: "delete"
}

transport.restMethod = method => {
	let restMethod
	const serviceMethodArgs = getArgs(method)
	if (Object.keys(transport.methodmap).includes(method.name)) {
		restMethod = transport.methodmap[method.name]
	} else {
		restMethod = "get"
		if (serviceMethodArgs.includes("data")) restMethod = "post"
		if (serviceMethodArgs.includes("id") && serviceMethodArgs.includes("data"))
			restMethod = "put"
	}
	return restMethod
}

transport.restRoute = method => {
	const serviceMethodArgs = getArgs(method)
	let route = `/${serviceMethodArgs.includes("id") ? ":id" : ""}`
	if (!Object.keys(transport.methodmap).includes(method.name))
		route = `/${serviceMethodArgs.includes("id") ? ":id/" : ""}${method.name}`
	return route
}

transport.getArgs = method => {
	return getArgs(method)
}

transport.setup = (service, path) => {
	const router = express.Router()
	logging.log(`REST ROUTES FOR ${service.name}`, {
		type: logging.TYPES.INFO,
		level: logging.LEVELS.HIGH
	})

	Object.values(service.methods).forEach(method => {
		const restMethod = transport.restMethod(method)
		const route = transport.restRoute(method)

		logging.log(`${restMethod.toUpperCase()} ${route}`, {
			type: logging.TYPES.DEFAULT,
			level: logging.LEVELS.HIGH
		})

		router[restMethod](route, (req, res) => {
			try {
				const requestData = { ...req.body, ...req.query }

				const callerArgs = []
				const serviceMethodArgs = getArgs(method)
				if (serviceMethodArgs.includes("id")) callerArgs.push(req.params.id)
				if (serviceMethodArgs.includes("data")) callerArgs.push(requestData)

				logging.log(
					`Handling ${restMethod} ${service.name} with ${JSON.stringify(
						callerArgs
					)}`,
					{ type: logging.TYPES.DEFAULT, level: logging.LEVELS.MEDIUM }
				)

				const serviceItemPromise = method(...callerArgs)

				// We wrap in promise.resolve in-case the service method is a promise
				Promise.resolve(serviceItemPromise)
					.then(function(response) {
						if (serviceMethodArgs.includes("id") && !response) {
							handleNotFoundError(res, service)
						} else {
							res.json(filterResponseObject(response))
						}
					})
					.catch(error => {
						handleControllerError(res, service, error)
					})
			} catch (error) {
				handleControllerError(res, service, error)
			}
		})
	})

	transport.router.use(path, router)
}

module.exports = transport
