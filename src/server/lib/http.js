const port = require("./port")
const http = require("http")
const { Logger } = require("./logging")
const logging = new Logger("lib/http")

async function startHTTPServer(expressApp, attempt = 0) {
	attempt++
	// Set the indicated port
	expressApp.set("port", port.get())
	logging.log("Attempting to start HTTP server on port " + port.get())

	// Create the server
	const server = http.createServer(expressApp)

	const result = new Promise(function(resolve, reject) {
		server.on("listening", resolve)
		server.on("error", reject)
	})

	server.listen(port.get())

	try {
		await result
		logging.log("HTTP server up on port " + port.get(), {
			type: logging.TYPES.SUCCESS
		})
	} catch (error) {
		console.error(error)

		if (error.syscall !== "listen") {
			throw error
		}

		if (error.code === "EADDRINUSE") {
			if (attempt < 5) {
				logging.log(`Port ${port.get()} in use`, {
					type: logging.TYPES.WARNING,
					level: logging.LEVELS.LOW
				})
				port.increment()
				// Prevent error messages on destroy
				server.removeAllListeners("error")
				delete server

				// Try starting server again
				startHTTPServer(expressApp, attempt)
			} else {
				throw new Error("Could not find an available port")
			}
		}
	}

	return server
}

module.exports = { startHTTPServer }
