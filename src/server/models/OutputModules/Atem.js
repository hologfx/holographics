let AtemSDK

const { Logger } = require("../../lib/logging")
const logging = new Logger("models/OutputModules/Atem")
const { bgraToAtemYUVA } = require("../../lib/pixelconvert")

module.exports = {
	name: "Blackmagic Atem Media Player",
	description:
		"Provides the ability to render widgets and entries to the Atem media pool",
	renders: {
		stills: true
	},
	default: {
		props: {
			ip: "192.168.10.240",
			activate_mp1: false,
			activate_mp2: false,
			upload_to_still: 1
		}
	},
	props: [
		{
			name: "ip",
			description: "IP Address",
			type: "String"
		},
		{
			name: "activate_mp1",
			description: "After upload, activate still on media player 1",
			type: "Radio",
			options: [
				{
					name: "Yes",
					value: true
				},
				{
					name: "No",
					value: false
				}
			]
		},
		{
			name: "activate_mp2",
			description: "After upload, activate still on media player 2",
			type: "Radio",
			options: [
				{
					name: "Yes",
					value: true
				},
				{
					name: "No",
					value: false
				}
			]
		},
		{
			name: "upload_to_still",
			description: "Start uploading to still number",
			type: "Number"
		}
	],
	updateConfig: async output => {
		try {
			AtemSDK = require("atem-connection").Atem
		} catch (error) {
			console.error(error)
			output.status(output.STATUS_ERROR, "Atem support unavailable")
			return false
		}

		// Only (re)connect when there's no live instance or the IP changed —
		// updateConfig runs on every config edit, so reconnecting each time
		// would churn the connection.
		if (output.instance && output._atemIp === output.props.ip) {
			return true
		}

		if (output.instance) {
			output.instance.disconnect()
			output.instance.removeAllListeners()
			delete output.instance
			output.AtemProductIdentifier = undefined
			output.AtemMaxMediaPoolSize = undefined
		}

		output._atemIp = output.props.ip
		output.instance = new AtemSDK({
			// Route the SDK's internal chatter (e.g. "reconnect") through our
			// logger instead of bare console.log.
			externalLog: (...args) =>
				logging.log(args.join(" "), { level: logging.LEVELS.LOW })
		})

		output.status(output.STATUS_WARNING, "Connecting...")

		try {
			output.instance.connect(output.props.ip)
		} catch (error) {
			console.error(error)
			output.status(output.STATUS_ERROR, "Could not connect to Atem")
			return false
		}

		output.instance.on("connected", () => {
			output.AtemProductIdentifier =
				output.instance.state.info.productIdentifier
			output.AtemMaxMediaPoolSize = output.instance.state.media.stillPool.length

			output.status(
				output.STATUS_OK,
				`Connected to ${output.AtemProductIdentifier}`
			)
			logging.log(`Connected to ${output.AtemProductIdentifier}`, {
				type: logging.TYPES.SUCCESS
			})
		})
		output.instance.on("disconnected", () => {
			output.status(output.STATUS_ERROR, "Disconnected")
			logging.log(`Disconnected from ${output.AtemProductIdentifier}`, {
				type: logging.TYPES.ERROR
			})
		})
		output.instance.on("error", error => {
			output.status(output.STATUS_WARNING, "An error occured")
			logging.error(error)
		})
	},
	handleFrame: async (output, nativeImage, i, name, context) => {
		if (output.currentStatus !== output.STATUS_OK || !output.instance) {
			output.status(
				output.STATUS_ERROR,
				"Cannot upload to Atem: not connected"
			)
			throw new Error("Atem not connected")
		}

		const stillIndex = Number(output.props.upload_to_still || 1) - 1 + i

		if (output.AtemMaxMediaPoolSize <= stillIndex) {
			output.status(output.STATUS_ERROR, "Max Atem still pool size exceeded")
			throw new Error("Max Atem still pool size exceeded")
		}

		try {
			const imageBitmap = nativeImage.toBitmap()
			const YUVimage = bgraToAtemYUVA(output.width, output.height, imageBitmap)

			await output.instance.dataTransferManager.uploadStill(
				stillIndex,
				YUVimage,
				name,
				context
			)

			if (output.props.activate_mp1)
				output.instance.setMediaPlayerSource({ stillIndex }, 0)
			if (output.props.activate_mp2)
				output.instance.setMediaPlayerSource({ stillIndex }, 1)

			output.status(output.STATUS_OK, `Uploaded still ${stillIndex + 1}`)
		} catch (error) {
			console.error(error)
			output.status(output.STATUS_ERROR, "Failed to upload still to Atem")
			throw error
		}
	}
}
