const settings = require("./settings")

const port = {}

port.int = port.int || 3000
if (settings.getState().port !== 3000)
	port.int = normalizePort(settings.getState().port)
if (process.env.PORT) port.int = normalizePort(process.env.PORT)

/**
 *
 *
 * @param {*} val
 * @returns
 */
function normalizePort(val) {
	var port = parseInt(val, 10)
	if (isNaN(port)) {
		return val
	}

	if (port >= 0) {
		return port
	}

	return false
}

port.set = int => {
	port.int = normalizePort(int)
}

port.get = () => {
	return port.int
}

port.increment = () => {
	port.int = port.int + 80
}

module.exports = port
