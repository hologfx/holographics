const { Logger } = require("../lib/logging")
const logging = new Logger("models/Output")

const Measurement = require("../util/measurement")

const buildUrl = require("build-url")
const port = require("../lib/port")
const Render = require("../lib/render")

// Models
const BaseDBModel = require("./BaseDBModel")

class Output extends BaseDBModel {
	constructor(values) {
		if (typeof values !== "object")
			throw new Error("Must provide values object")
		if (!values.type) throw new Error("Must set output type")

		values.width = values.width || 1920
		values.height = values.height || 1080
		values.framerate = values.framerate || 30
		values.persistKeys = [
			"type",
			"width",
			"height",
			"framerate",
			"props",
			"status"
		]
		values.serverOnlyKeys = values.serverOnlyKeys || []
		values.serverOnlyKeys.push(
			"STATUS_OK",
			"STATUS_WARNING",
			"STATUS_ERROR",
			"instance",
			// The Render instance (BrowserWindow + the invalidate Timeout) is
			// server-only and circular — serializing it overflows socket.io.
			"renderer"
		)

		values.STATUS_OK = "STATUS_OK"
		values.STATUS_WARNING = "STATUS_WARNING"
		values.STATUS_ERROR = "STATUS_ERROR"

		super(values)
		
		if (!OutputModule.findBySlug(values.type)) {
			// Delete self
			this.remove()
			return
		}

		this.props = values.props || this.outputModule.default.props || {}
		this.rendering = this.rendering || {
			stream: false,
			stills: false,
			current: 0,
			total: 0,
			fps: 0
		}

		this.refreshable = typeof this.outputModule.initialize === "function"

		this.refresh().then(() => {
			this.updateConfig()
		})
	}

	// Called on initialization and when using the refresh button
	async refresh() {
		if (typeof this.outputModule.initialize === "function") {
			try {
				await this.outputModule.initialize(this)
			} catch (error) {
				logging.log(error)
				this.status(this.STATUS_ERROR, "Error initializing output")
			}
			this.outputModule.constructor.emitChanged()
		}
		return true
	}

	// Called every time the configuration for a module changes
	async updateConfig() {
		if (typeof this.outputModule.updateConfig === "function") {
			try {
				await this.outputModule.updateConfig(this)
			} catch (error) {
				logging.log(error)
				this.status(this.STATUS_ERROR, "Error updating output configuration")
			}
			this.outputModule.constructor.emitChanged()
		}
		return true
	}

	beforeSave() {
		// console.log(this)
		this.updateConfig()
	}

	status(level, message) {
		// STATUS_OK fires every measurement while streaming — too noisy to log.
		if (level !== this.STATUS_OK) {
			logging.log(`Output ${this.type} new status: ${level} - ${message}`)
		}
		this.currentStatus = level
		this.currentStatusMessage = message
		this.constructor.emitChanged()
	}

	get outputModule() {
		return OutputModule.findBySlug(this.type)
	}

	renderURL(showId, theme) {
		return buildUrl(`http://localhost:${port.get()}`, {
			path: "render",
			queryParams: {
				still: this.outputModule.renders.stills || undefined,
				theme,
				showId
			}
		})
	}

	getFrameMetadata(id) {
		const widget = Widget.findById(id)
		const entry = Entry.findById(id)

		// The owning widget — for an entry that's its parent, otherwise the id itself.
		const owner = Widget.findById((entry && entry.widgetId) || id)
		if (!owner) return undefined

		const widgetName = owner.name
		const widgetModule = owner.widgetModule

		if (widget)
			return {
				name: widgetName || widgetModule.name,
				context: widgetName || widgetModule.name
			}
		if (entry)
			return {
				name: entry.props[widgetModule.entry_props[0].name],
				context: widgetName || widgetModule.name
			}
		return undefined
	}

	startRenderer() {
		this.renderer = new Render(this.width, this.height, this.framerate)
		this.constructor.emitChanged()
	}

	async renderFrames(ids) {
		let i = 0
		if (this.rendering.stills)
			throw new Error("Must wait until current render is complete")

		this.rendering.stills = true
		this.rendering.total = ids.length
		this.startRenderer()

		try {
			for (const id of ids) {
				if (!this.renderer) break
				const url = this.renderURL(id)
				const { name, context } = this.getFrameMetadata(id) || {}

				logging.log(`Rendering ${i + 1} of ${ids.length}: ${url}`)
				const nativeImage = await this.renderer.renderFrame(url)

				await this.outputModule.handleFrame(this, nativeImage, i, name, context)
				i++
				this.rendering.current = i
				this.constructor.emitChanged()
			}

			this.stopRenderer()
			return this.rendering
		} catch (error) {
			this.stopRenderer()
			throw error
		}
	}

	async renderStream() {
		if (this.rendering.stream) return // idempotent: ignore double-Start

		this.rendering.stream = true
		this.startRenderer()
		const renderer = this.renderer // this loop owns THIS renderer

		const url = this.renderURL()
		logging.log(`Initializing render on URL: ${url}`)

		const timing = new Measurement(100)

		try {
			for await (const nativeImage of renderer.renderStream(url)) {
				// Stopped, deleted, or replaced by a newer Start -> end this loop.
				if (this.renderer !== renderer || !this.rendering.stream) break
				await this.outputModule.handleFrame(this, nativeImage, this.rendering.current)
				const time = timing.takeMeasurement()
				this.rendering.current = time.i
				if (time.hz) {
					this.rendering.fps = Math.round(time.hz)
					this.status(
						this.rendering.fps < Math.round(this.framerate) - 1
							? this.STATUS_WARNING // dropping frames
							: this.STATUS_OK,
						"Streaming"
					)
				}
			}
		} catch (error) {
			logging.log(error)
			this.stopRenderer()
		}
	}

	stopRenderer() {
		if (this.rendering.stills || this.rendering.stream) {
			const renderer = this.renderer
			if (renderer) {
				renderer.destroy()
				setTimeout(() => {
					// A newer Start may now own this.renderer; only tear down ours.
					if (this.renderer !== renderer) return
					delete this.renderer
					if (typeof this.outputModule.destroy === "function") {
						this.outputModule.destroy(this)
					}
				}, 1500)
			}
			this.rendering = {
				stills: false,
				stream: false,
				total: 0,
				current: 0,
				fps: 0
			}
		}
		this.constructor.emitChanged()
		return this.rendering
	}

	remove() {
		this.stopRenderer()
		return super.remove()
	}
}

module.exports = Output
