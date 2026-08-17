let BrowserWindow, screen, factor, app

try {
	BrowserWindow = require("electron").BrowserWindow
	screen = require("electron").screen
	factor = screen.getPrimaryDisplay().scaleFactor
	app = require("electron").app
} catch (e) {}

const { Logger } = require("./logging")
const logging = new Logger("lib/render")

const _ = require("lodash")

class Render {
	constructor(width, height, frameRate) {
		this.width = width || 1920
		this.height = height || 1080
		this.frameRate = frameRate || 30
		this.interrupt = false

		if (appMode.environment !== "electron")
			throw Error("Rendering is only supported in Electron mode")

		logging.log(
			`Initializing new BrowserWindow ${this.width}x${this.height} (display factor ${factor})`
		)

		this.win = new BrowserWindow({
			show: false,
			width: this.width,
			height: this.height,
			enableLargerThanScreen: true,
			resizable: false,
			skipTaskbar: true,
			transparent: true,
			backgroundColor: "#00000000",
			webPreferences: {
				offscreen: true,
				zoomFactor: 1.0
			}
		})
		this.win.setSize(this.width, this.height)
	}

	async renderFrame(url) {
		this.win.loadURL(url)

		await new Promise(resolve => {
			this.win.webContents.once("did-finish-load", resolve)
		})

		// This is our promise resolve hook
		let haveLastFrame

		// Create a new promise to resolve when we've received the last frame
		const lastFrame = new Promise(resolve => {
			haveLastFrame = resolve
		})

		// webContents will only paint when changes occur
		// We debounce the paint event and resolve the above promise
		// when we don't receive a new frame for 150ms
		this.win.webContents.on(
			"paint",
			_.debounce(
				(event, dirty, image) => {
					haveLastFrame(image)
				},
				700,
				{
					maxWait: 3000
				}
			)
		)

		// Now await the lastFrame promise
		const image = await lastFrame

		// Return the image
		return image
	}

	async *renderStream(url) {
		logging.log("Loading URL: " + url)
		this.win.loadURL(url)

		await new Promise(resolve => {
			this.win.webContents.once("did-finish-load", resolve)
		})
		this.win.webContents.frameRate = Math.round(this.frameRate)
		logging.log("Window loaded. Setting framerate: " + this.frameRate)

		// Offscreen rendering only paints when the page changes, so a static page
		// would starve the DeckLink of frames. Force a repaint at the target rate.
		// A plain setInterval truncates the fractional ms (e.g. 16.667 -> 16) and
		// overshoots (~62fps instead of 60), so drift-correct against absolute
		// frame times to average exactly to the mode rate.
		const frameInterval = 1000 / this.frameRate
		let nextFrame = Date.now() + frameInterval
		const tick = () => {
			if (this.interrupt) return
			this.win.webContents.invalidate()
			nextFrame += frameInterval
			let delay = nextFrame - Date.now()
			if (delay < -frameInterval) {
				// Fell behind (a stall) — resync instead of firing a catch-up burst.
				nextFrame = Date.now() + frameInterval
				delay = frameInterval
			}
			this._invalidateTimer = setTimeout(tick, Math.max(0, delay))
		}
		this._invalidateTimer = setTimeout(tick, frameInterval)

		let i = 0

		while (!this.interrupt) {
			const image = await this._nextPaint()
			// destroy() can resolve the wait early to break us out of the loop.
			if (this.interrupt) break
			// Drop the first 10 frames
			if (i < 10) {
				i++
			} else {
				yield image
			}
		}
	}

	// Resolve on the next paint, or early (null) if destroy() is called while waiting.
	_nextPaint() {
		return new Promise(resolve => {
			const onPaint = (event, dirty, image) => resolve(image)
			this.win.webContents.once("paint", onPaint)
			this._cancelPaint = () => {
				this.win.webContents.removeListener("paint", onPaint)
				resolve(null)
			}
		})
	}

	destroy() {
		this.interrupt = true
		if (this._invalidateTimer) clearTimeout(this._invalidateTimer)
		if (this._cancelPaint) this._cancelPaint()
		setTimeout(() => {
			this.win.destroy()
		}, 1000)
	}
}

module.exports = Render