// const settings = require('./settings')
const EventEmitter = require("events")
const settings = require("./settings")
const fs = require("fs")
const chalk = require("chalk")
const moment = require("moment")

class ApplicationLog {
	static logMessage({ lib, libPath, msg, level, type, stack }) {
		// Logging a message should never crash Holographics
		try {
			const message = {}
			if (lib) message.lib = lib
			if (libPath) message.libPath = libPath
			if (stack) message.stack = stack

			if (typeof msg === "object") {
				msg = JSON.stringify(msg)
			}

			message.msg = msg
			message.level = level || this.prototype.LEVELS.LOW
			message.type = type || this.prototype.TYPES.DEFAULT
			message.timestamp = Date.now()

			// Keep the size of the log file in check
			try {
				const stats = fs.statSync(`${global.user_data_dir}/holographics.log`)
				const fileSizeInBytes = stats.size
				const fileSizeInMegabytes = fileSizeInBytes / 1000000.0
				if (fileSizeInMegabytes > 10) {
					fs.unlinkSync(`${global.user_data_dir}/holographics.log`)
				}
			} catch (e) {}

			fs.appendFileSync(
				`${global.user_data_dir}/holographics.log`,
				JSON.stringify(message) + "\n"
			)

			this.prototype.history.push(message)
			this.logToConsole(message)
			module.exports.Events.emit("log", message)
			return message
		} catch (e) {
			console.log("An error occured processing log message")
			console.log(e)
		}
	}

	static setLevel(level) {
		if (typeof level === "number") {
			this.level = level
		} else {
			this.level = this.prototype.LEVELS[level]
		}
	}

	static shouldLog(level) {
		return level <= (this.level || this.prototype.LEVELS.LOW)
	}

	static markupMessage({ lib, libPath, msg, level, type, stack, timestamp }) {
		let consoleString = ""
		consoleString += `${chalk.gray(moment(timestamp).format("HH:mm:ss"))} `
		consoleString += chalk.magenta(`[${lib.toUpperCase()}] `)

		if (type === this.prototype.TYPES.DEFAULT) consoleString += `${msg}`
		if (type === this.prototype.TYPES.INFO)
			consoleString += `${chalk.white.bgBlue(msg)}`
		if (type === this.prototype.TYPES.ERROR)
			consoleString += `${chalk.white.bgRed(msg)}`
		if (type === this.prototype.TYPES.WARNING)
			consoleString += `${chalk.white.bgYellow(msg)}`
		if (type === this.prototype.TYPES.SUCCESS)
			consoleString += `${chalk.white.bgGreen(msg)}`

		consoleString += chalk.gray(` (${libPath})`)
		consoleString += " "
		if (stack) consoleString += `- stacktrace:\n ${chalk.white.bgRed(stack)}`
		return consoleString
	}

	static logToConsole(message) {
		if (!this.shouldLog(message.level)) return
		const consoleString = this.markupMessage(message)
		console.log(consoleString)
	}

	static readLogFromFile(path) {
		let file = ""
		try {
			file = fs.readFileSync(path).toString()
		} catch (e) {}
		const entries = []
		file.split("\n").forEach(entry => {
			try {
				entries.push(JSON.parse(entry))
			} catch (e) {}
		})
		return entries
	}

	static filterBy(criteria) {
		return ApplicationLog.prototype.history.filter(function(obj) {
			return Object.keys(criteria).every(function(c) {
				return obj[c] === criteria[c]
			})
		})
	}

	get LEVELS() {
		return {
			LOW: 1,
			MEDIUM: 2,
			HIGH: 3
		}
	}

	get TYPES() {
		return {
			DEFAULT: "DEFAULT",
			INFO: "INFO",
			ERROR: "ERROR",
			SUCCESS: "SUCCESS",
			WARNING: "WARNING"
		}
	}
}

module.exports.Events = new EventEmitter()
ApplicationLog.prototype.history = ApplicationLog.readLogFromFile(
	`${global.user_data_dir}/holographics.log`
)

if (
	settings.getState().logging.level &&
	ApplicationLog.prototype.LEVELS[settings.getState().logging.level]
) {
	ApplicationLog.level =
		ApplicationLog.prototype.LEVELS[settings.getState().logging.level]
} else {
	ApplicationLog.level = ApplicationLog.prototype.LEVELS.LOW
}

class Logger extends ApplicationLog {
	constructor(libPath) {
		super()
		this.libPath = libPath
		if (!libPath) throw Error("Must initialize logger with a libPath")
		this.lib = libPath.split("/").pop()
	}

	log(msg, { level, type } = {}) {
		this.constructor.logMessage({
			lib: this.lib,
			libPath: this.libPath,
			msg,
			level,
			type
		})
	}

	error(error) {
		this.constructor.logMessage({
			lib: this.lib,
			libPath: this.libPath,
			type: this.TYPES.ERROR,
			level: this.LEVELS.LOW,
			msg: error.message,
			stack: error.stack
		})
	}
}

module.exports.ApplicationLog = ApplicationLog
module.exports.Logger = Logger
