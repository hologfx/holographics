const changelog = {}

const fs = require("fs")

changelog.get = function(version) {
	return JSON.parse(fs.readFileSync("./changelog.json"))[version] || undefined
}

changelog.set = function(version, changes) {
	const current = JSON.parse(fs.readFileSync("./changelog.json"))
	current[version] = changes
	fs.writeFileSync("./changelog.json", JSON.stringify(current, null, " "))
}

module.exports = changelog
