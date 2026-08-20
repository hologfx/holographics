const { Logger } = require("../lib/logging")
const logging = new Logger("lib/errors")

class ApplicationError extends Error {
	constructor(message, code, className, data, track = true) {
		super()

		this.name = this.constructor.name

		if (!this.stack) {
			Error.captureStackTrace(this, this.constructor)
		}

		this.code = code || 500

		this.message = message || "Unknown error"

		this.className = className || "danger"

		this.data = data || {}

		logging.error(this)
	}
}

class ControllerError extends ApplicationError {
	constructor(service, error) {
		logging.error(error)
		super(
			error.message || "An error occurred handling that request",
			400,
			"danger",
			{ service: service && service.name }
		)
	}
}

class NotFoundError extends ApplicationError {
	constructor(service) {
		if (service) {
			super(
				`The ${service.name} you requested could not be found`,
				404,
				"warning",
				{ service: service.name }
			)
		} else {
			super("That resource was not found", 404, "warning")
		}
	}
}

class StylusRenderError extends ApplicationError {
	constructor(e) {
		super(`Stylus render error\n${e.message}`, 422, "warning", {}, false)
	}
}

class ThemeNotFoundError extends ApplicationError {
	constructor() {
		super("Theme not found", 404, "danger", {}, false)
	}
}

class UpdateError extends ApplicationError {
	constructor(msg) {
		super(msg || "Error checking for updates", 500, "warning", {}, false)
	}
}

class InvalidInputError extends ApplicationError {
	constructor(msg) {
		super(msg || "Invalid input provided", 400, "warning", {}, false)
	}
}

module.exports = {
	ApplicationError,
	ControllerError,
	NotFoundError,
	StylusRenderError,
	ThemeNotFoundError,
	InvalidInputError,
	UpdateError
}
