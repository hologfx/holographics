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

		process.emit("finishedStartup", port.get())
	} catch (error) {
		console.error(error)
	}
}

module.exports = {
	startHolographics,
	lib: {},
	models,
	services: {},
	transports: {}
}
