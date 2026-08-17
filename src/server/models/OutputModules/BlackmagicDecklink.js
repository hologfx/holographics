const { Logger } = require("../../lib/logging")
const logging = new Logger("models/OutputModules/BlackmagicDecklink")
const { bgraToUYVY, bgraToARGB, premultiplyBGRA } = require("../../lib/pixelconvert")

let macadam

// macadam videoMode string -> macadam pixelFormat constant name. The Electron
// frame is 8-bit BGRA, so these are the only targets we convert to.
const FORMAT_CONSTANTS = {
	"8-bit YUV": "bmdFormat8BitYUV",
	"8-bit BGRA": "bmdFormat8BitBGRA",
	"8-bit ARGB": "bmdFormat8BitARGB"
}

// Human-readable description of the signal we send, incl. the conversion applied
// to the Electron BGRA frame. Surfaced to the UI as output.signalFormat.
const SIGNAL_LABELS = {
	"8-bit YUV": "8-bit YUV 4:2:2 (converted from RGB)",
	"8-bit BGRA": "8-bit BGRA — key & fill (premultiplied alpha)",
	"8-bit ARGB": "8-bit ARGB — key & fill (premultiplied alpha)"
}

// Formats usable for a given keying mode, in preference order. Keying needs an
// alpha channel (RGB), so YUV is only usable when keying is off.
const requiredFormatsFor = keying =>
	keying === "internal" || keying === "external"
		? ["8-bit BGRA", "8-bit ARGB"]
		: ["8-bit YUV"]

// getDeviceInfo() display modes carry no bmdMode constant, but playback() needs
// one (without it macadam silently defaults to bmdModeHD1080i50, so the frame
// buffer size never matches the selected mode -> "Insufficient bytes" / wrong
// output). Reverse-map by width + height + frame duration; the only HD collision
// (1080i50 vs 1080p25, identical size + grain) is disambiguated by interlace,
// inferred from the mode name (e.g. "1080i50").
const findDisplayModeConstant = dm => {
	const wantInterlace = /i\d/i.test(dm.name)
	let fallback
	for (const key of Object.keys(macadam)) {
		if (!key.startsWith("bmdMode")) continue
		const mode = macadam[key]
		if (typeof mode !== "number") continue
		if (macadam.modeWidth(mode) !== dm.width) continue
		if (macadam.modeHeight(mode) !== dm.height) continue
		const grain = macadam.modeGrainDuration(mode)
		if (grain[0] !== dm.frameRate[0] || grain[1] !== dm.frameRate[1]) continue
		fallback = mode
		if (macadam.modeInterlace(mode) === wantInterlace) return mode
	}
	return fallback
}

const initializePlayback = async output => {
	if (!macadam) {
		output.status(output.STATUS_ERROR, "DeckLink driver or device not available")
		return false
	}

	// Don't keep retrying once we're in an error state — let the render loop stop.
	if (output.currentStatus === output.STATUS_ERROR) {
		return false
	}

	if (!output.instance) {
		try {
			logging.log("Initializing BlackmagicDecklink playback instance")

			const options = {
				deviceIndex: output.props.decklink_device,
				displayMode: output.decklinkDisplayMode,
				pixelFormat: output.outputPixelFormat,
				enableKeying: output.props.keying !== "none",
				isExternal: output.props.keying === "external" ? true : undefined
			}

			logging.log(options)
			output.instance = await macadam.playback(options)
			return true
		} catch (error) {
			console.error(error)
			output.status(output.STATUS_ERROR, "Error initializing output")
			output.stopRenderer()
			return false
		}
	}

	return true
}

module.exports = {
	name: "Blackmagic Decklink Output",
	slug: "UltraStudioHD",
	providesVideoFormat: true,
	description:
		"This output provides the ability to render Key & Fill video to Blackmagic DeckLink / UltraStudio devices.",
		default: {
			props: {
				decklink_device: 0
			}
		},
		props: [
			{
				name: "decklink_device",
				description: "Select your DeckLink device",
				type: "Select",
				options: []
			},
			{
				name: "displaymode",
				description: "Select your display mode",
				type: "Select",
				options: []
			},
			{
				name: "keying",
				description: "Select your keying method",
				type: "Select",
				options: [
					{
						name: "None",
						value: "none"
					}
				]
			}
		],
	methods: [
		{
			name: "Refresh",
			description: "Refreshes available decklink devices",
			perform: () => {
				module.exports.initialize()
			}
		}
	],
	renders: {
		stream: true
	},
	initialize: async output => {
		output.stopRenderer()

		const decklinkDevicesProp = module.exports.props.find(
			p => p.name === "decklink_device"
		).options
		decklinkDevicesProp.length = 0

		// macadam is an optional native dependency; a missing driver or no
		// attached device must degrade to a status, not crash the server.
		let devices
		try {
			macadam = require("macadam")
			devices = macadam.getDeviceInfo()
		} catch (error) {
			console.error(error)
			macadam = undefined
			output.decklinkDevices = []
			output.status(output.STATUS_ERROR, "DeckLink driver or device not available")
			return
		}

		output.decklinkDevices = devices

		devices.forEach((d, index) => {
			// Include any device with a mode we can target (we convert the BGRA
			// frame to YUV/BGRA/ARGB as needed) — effectively all SDI devices.
			if (d.outputDisplayModes.find(displayMode =>
				displayMode.videoModes.some(m => FORMAT_CONSTANTS[m])
			)) {
				decklinkDevicesProp.push({
					name: d.displayName,
					value: index
				})
			}
		})

		if (decklinkDevicesProp.length === 0) {
			output.status(output.STATUS_ERROR, "No DeckLink device found")
		}
	},
	updateConfig: async output => {
		// Cleared until a valid config resolves, so the UI signal panel hides on error.
		output.signalFormat = undefined

		const decklinkDevice =
			output.decklinkDevices &&
			output.decklinkDevices[output.props.decklink_device]

		if (!decklinkDevice) {
			output.status(output.STATUS_ERROR, "No DeckLink device found")
			return false
		}

		const keying = output.props.keying || "none"
		const requiredFormats = requiredFormatsFor(keying)

		const displayModesProp = module.exports.props.find(
			p => p.name === "displaymode"
			).options
		displayModesProp.length = 0
		decklinkDevice.outputDisplayModes.forEach((displayMode, index) => {
			if (displayMode.videoModes.some(m => requiredFormats.includes(m))) {
				displayModesProp.push({ name: displayMode.name, value: index })
			}
		})

		const keyingProp = module.exports.props.find(
			p => p.name === "keying"
		).options
		
		keyingProp.length = 1
		
		if (decklinkDevice.supportsInternalKeying) {
			keyingProp.push({
				name: "Internal",
				value: "internal"      
			})
		}
		if (decklinkDevice.supportsExternalKeying) {
			keyingProp.push({
				name: "External",
				value: "external"
			})
		}

		const displayMode = decklinkDevice.outputDisplayModes[output.props.displaymode]

		if (!displayMode) {
			output.status(output.STATUS_ERROR, "No displaymode selected")
			return false
		}

		// Pick the output pixel format the device supports for this keying mode
		// (we convert the BGRA frame to it in handleFrame).
		const format = requiredFormats.find(f =>
			displayMode.videoModes.includes(f)
		)
		if (!format) {
			output.status(
				output.STATUS_ERROR,
				"Device does not support keying in this display mode"
			)
			return false
		}
		output.outputPixelFormat = macadam[FORMAT_CONSTANTS[format]]
		output.signalFormat = SIGNAL_LABELS[format]

		output.decklinkDisplayMode = findDisplayModeConstant(displayMode)
		if (output.decklinkDisplayMode === undefined) {
			output.status(output.STATUS_ERROR, "Unsupported display mode")
			return false
		}

		output.width = displayMode.width
		output.height = displayMode.height

		if (macadam.modeInterlace(output.decklinkDisplayMode)) {
			output.framerate = displayMode.frameRate[1] / 500
		} else {
			output.framerate = displayMode.frameRate[1] / 1000
		}

		output.status(output.STATUS_OK, `${decklinkDevice.displayName} ready`)
	},
	handleFrame: async (output, nativeImage, frameIndex) => {
		if (!(await initializePlayback(output))) {
			output.stopRenderer()
		}

		try {
			if (output.instance) {
				const bitmap = await nativeImage.toBitmap()

				// The rendered bitmap must be exactly width*height*4 (BGRA) or the
				// DeckLink frame buffer size won't match the display mode. Warn once
				// if it doesn't (e.g. a HiDPI scale-factor regression in the renderer).
				if (bitmap.length !== output.width * output.height * 4 && !output._frameWarned) {
					output._frameWarned = true
					const size = nativeImage.getSize && nativeImage.getSize()
					logging.log(
						`Frame size mismatch: rendered ${size && size.width}x${size && size.height} ` +
						`(${bitmap.length} bytes) but ${output.width}x${output.height} ` +
						`(${output.width * output.height * 4} bytes) expected`
					)
				}

				// BGRA/ARGB formats are only used for keying, which needs
				// premultiplied alpha; YUV (non-keyed) has no alpha channel.
				let frame
				if (output.outputPixelFormat === macadam.bmdFormat8BitYUV) {
					frame = bgraToUYVY(output.width, output.height, bitmap)
				} else if (output.outputPixelFormat === macadam.bmdFormat8BitARGB) {
					frame = bgraToARGB(
						output.width,
						output.height,
						premultiplyBGRA(output.width, output.height, bitmap)
					)
				} else {
					frame = premultiplyBGRA(output.width, output.height, bitmap)
				}
				await output.instance.displayFrame(frame)
			}
		} catch (error) {
			console.error(error)
			output.status(output.STATUS_ERROR, "Error displaying frame")
			output.stopRenderer()
		}
	},
	destroy: output => {
		try {
			logging.log("Destroying BlackmagicDecklink playback instance")
			if (output.instance) output.instance.stop()
		} catch (error) {
			console.error(error)
		}
		output.instance = undefined
	}
}
