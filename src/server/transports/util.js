module.exports.filterResponseObject = response => {
	if (!response) return response
	if (Array.isArray(response)) {
		const filtered = []
		response.forEach(item => {
			filtered.push(item.filterForTransport ? item.filterForTransport() : item)
		})
		return filtered
	} else {
		return response.filterForTransport
			? response.filterForTransport()
			: response
	}
}

module.exports.getArgs = func => {
	const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
	const ARGUMENT_NAMES = /([^\s,]+)/g
	const fnStr = func.toString().replace(STRIP_COMMENTS, "")
	let result = fnStr
		.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
		.match(ARGUMENT_NAMES)
	if (result === null) result = []
	return result
}
