module.exports = {
	logo:
		"\n _   _       _                             _     _          \n| | | |     | |                           | |   (_)         \n| |_| | ___ | | ___   __ _ _ __ __ _ _ __ | |__  _  ___ ___ \n|  _  |/ _ \\| |/ _ \\ / _` | '__/ _` | '_ \\| '_ \\| |/ __/ __|\n| | | | (_) | | (_) | (_| | | | (_| | |_) | | | | | (__\\__ \\\n|_| |_/\\___/|_|\\___/ \\__, |_|  \\__,_| .__/|_| |_|_|\\___|___/\n                      __/ |         | |                     \n                     |___/          |_|                     \n",
	logLogo: () => {
		console.log(module.exports.logo)
	},
	logGlobals: () => {
		;[
			"path_to_app",
			"base_dir",
			"user_data_dir",
			"__filename",
			"__dirname"
		].forEach(globalVar => {
			logging.log(`${globalVar}: ${global[globalVar]}`, {
				type: logging.TYPES.INFO,
				level: logging.LEVELS.HIGH
			})
		})

		logging.log("Node env: " + process.env.NODE_ENV, {
			type: logging.TYPES.INFO,
			level: logging.LEVELS.HIGH
		})
		logging.log("CWD: " + process.cwd(), {
			type: logging.TYPES.INFO,
			level: logging.LEVELS.HIGH
		})
		logging.log(
			`AppMode: ${appMode.environment}, ${
				appMode.packed ? "packed" : "from source"
			}, in ${appMode.development ? "development mode" : "production mode"}`,
			{ type: logging.TYPES.INFO, level: logging.LEVELS.LOW }
		)
	}
}
