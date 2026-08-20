// Environment setup
require("events").EventEmitter.defaultMaxListeners = 4

// libs
const { Logger } = require("./lib/logging")
const logging = new Logger("server")
const { express, createExpressApp } = require("./lib/express")
const io = require("./lib/io")
const http = require("./lib/http")
const port = require("./lib/port")
const assets = require("./lib/assets")

// Models
const models = require("./models")

// Services
const Service = require("./services")

// Transports
const transports = require("./transports")

// Utils
const measurement = require("./util/measurement")
const logOutputs = require("./util/logOutputs")

async function startHolographics() {
	try {
		process.emit("startupStatus", "Initializing models")
		models.globalize()

		process.emit("startupStatus", "Initializing API routes")
		const serviceRoutes = express.Router()
		Service.use(transports.express(serviceRoutes))
		Service.use(transports.socketio(io))
		Service.use(transports.osc())

		process.emit("startupStatus", "Mounting API routes")
		Service.list.forEach(service => {
			service.mount()
		})

		const expressApp = createExpressApp(serviceRoutes)

		process.emit("startupStatus", "Starting HTTP server")
		const server = await http.startHTTPServer(expressApp)
		io.attach(server)

		logOutputs.logLogo()

		logging.log(`Admin panel: http://localhost:${port.get()}/control`)
		logging.log(`Render panel: http://localhost:${port.get()}/render`)

		// Intelligent default handler
		process.emit("startupStatus", "Populating default assets")
		await assets.populateDefaults()

		// Initialize file watchers for auto refresh
		process.emit("startupStatus", "Initializing asset watcher")
		await assets.watchFiles()

		// Read all asset models from disk
		process.emit("startupStatus", "Reading assets from disk")
		await assets.readAll()

		process.emit("startupStatus", "Starting user interface")

		registerShutdown()

		process.emit("finishedStartup", port.get())
	} catch (error) {
		console.error(error)
	}
}

// Quitting with the asset watcher still open deadlocks the main thread: fsevents
// releases its threadsafe function during Node's environment cleanup and blocks
// forever on a mutex, so no timeout-based fallback can recover from it.
function registerShutdown() {
	let app
	try {
		app = require("electron").app
	} catch (error) {
		return
	}
	if (!app) return

	let quitting = false
	app.on("before-quit", async event => {
		if (quitting) return
		quitting = true
		event.preventDefault()

		try {
			const wasRendering = Output.all().some(
				output => output.rendering.stills || output.rendering.stream
			)
			Output.all().forEach(output => output.stopRenderer())
			await assets.stopWatching()
			if (wasRendering) {
				await new Promise(resolve => setTimeout(resolve, 2000))
			}
		} catch (error) {
			logging.log(error)
		}

		app.quit()
	})
}

module.exports = {
	startHolographics,
	lib: {},
	models,
	services: {},
	transports: {}
}
