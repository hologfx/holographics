const fs = require("fs-extra")
const path = require("path")

const { Logger } = require("../../lib/logging")
const logging = new Logger("models/OutputModules/PNG")

// Strip characters that would break a path or escape the destination folder —
// name/context come from user-entered widget/entry text.
const safe = s => String(s).replace(/[/\\?%*:|"<>]/g, "_").trim()

module.exports = {
	name: "PNG file",
	description:
		"Provides the ability to render widgets and entries to PNG files",
	renders: {
		stills: true
	},
	default: {
		props: {
			destination: `${user_data_dir}/rendered`,
			widget_subfolders: false
		}
	},
	props: [
		{
			name: "destination",
			description: "Destination folder",
			type: "FolderPicker"
		},
		{
			name: "widget_subfolders",
			description: "Place rendered files in subfolders by widget name",
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
		}
	],
	handleFrame: async (output, nativeImage, i, name, context) => {
		if (!output.props.destination) {
			output.status(output.STATUS_ERROR, "No destination folder set")
			throw new Error("No destination folder set")
		}

		const segments = [output.props.destination]
		if (output.props.widget_subfolders && context) segments.push(safe(context))

		const filename = `${safe(name) || i}.png`
		const dir = path.join(...segments)
		const file = path.join(dir, filename)

		try {
			fs.ensureDirSync(dir)
			fs.writeFileSync(file, nativeImage.toPNG())
			logging.log(`Wrote image to ${file}`)
			output.lastRenderCount = i + 1
			output.status(output.STATUS_OK, `Saved ${filename}`)
		} catch (error) {
			console.error(error)
			output.status(output.STATUS_ERROR, `Failed to write ${filename}`)
			throw error
		}
	}
}
