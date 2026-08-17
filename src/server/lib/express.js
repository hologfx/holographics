const express = require("express")
const path = require("path")
const favicon = require("serve-favicon")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const { Logger } = require("./logging")
const logging = new Logger("lib/express")

function createExpressApp(serviceRoutes) {
	const app = express()
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: false }))

	app.use(
		"/mediafiles",
		express.static(path.join(user_data_dir, "./mediafiles"))
	)

	if (app.get("env") !== "test") {
		app.use(
			morgan("dev", {
				skip: function(req, res) {
					return res.statusCode === 304
				}
			})
		)
	}

	let clientDir
	clientDir = path.join(base_dir, "./client")

	if (process.env.NODE_ENV === "development") {
		// We're in development mode, proxy all requests to /client where
		// presumable the webpack-dev-server is running
		const { createProxyMiddleware } = require("http-proxy-middleware")
		app.use(
			"/client",
			createProxyMiddleware({
				target: "http://localhost:8080/",
				changeOrigin: true
			})
		)
	} else {
		if (process.env.APP_ENV === "packed") {
			// We're packed by webpack, serve client files from dist dir
			clientDir = path.join(base_dir, "../client")
		} else {
			// We're not packed by webpack but are in production mode, serve client files from root /dist/client
			clientDir = path.join(base_dir, "../dist/client")
		}
	}

	app.use("/client", express.static(clientDir))

	favicon(path.join(clientDir, "public", "favicon.ico"))

	app.get("/", (req, res) => {
		res.redirect("/control/")
	})

	app.get("/control", (req, res) => {
		res.sendFile(path.join(clientDir, "/views/control.html"))
	})
	app.get("/render", (req, res) => {
		res.sendFile(path.join(clientDir, "/views/render.html"))
	})

	// Routing
	app.use("/api", serviceRoutes)

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error(req.url + " not Found")
		logging.log("404: " + req.url, {
			type: logging.TYPES.WARNING,
			level: logging.LEVELS.MEDIUM
		})
		err.status = 404
		next(err)
	})

	// error handlers

	// development error handler
	// will print stacktrace
	const isDevelopment = app.get("env") === "development" || "test"
	if (isDevelopment) {
		app.use(function(err, req, res, next) {
			if (err.status !== 404) logging.log(err.stack, "danger", 2)
			res.status(err.status || 500)
			res.json({ message: err.message, error: err })
		})
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500)
		res.json({ message: err.message, error: err })
	})

	return app
}

module.exports = { express, createExpressApp }
