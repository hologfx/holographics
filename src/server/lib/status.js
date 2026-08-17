const EventEmitter = require("events")
const appVersion = require("../../../package.json").version

// Status utilities
const IPLib = require("ip")

const port = require("./port")

const status = new EventEmitter()

status.cache = {
	ip: "",
	port: port.get(),
	version: appVersion
}

status.get = () => {
	return status.cache
}

status.set = function(key, value) {
	if (status.cache[key] === undefined) {
		status.cache[key] = value
	} else if (status.cache[key] !== value) {
		status.cache[key] = value
		status.emit("statusChanged", status.cache)
	}
}

status.refresh = async () => {
	try {
		const ip = IPLib.address()
		status.set("ip", ip)
		status.set("port", port.get())
	} catch (error) {
		console.log("Problem setting status: " + error.message)
	}
}

status.refresh()
setInterval(status.refresh, 15000)

module.exports = status
