const { Logger } = require("../lib/logging")
const logging = new Logger("models/OutputModule")

const Atem = require("./OutputModules/Atem")
const BlackmagicDecklink = require("./OutputModules/BlackmagicDecklink")
const PNG = require("./OutputModules/PNG")

// Models
const BaseMemoryModel = require("./BaseMemoryModel")

class OutputModule extends BaseMemoryModel {
	constructor(outputModule) {
    super(outputModule)
	}

	static get all() {
		this._instances = this._instances || [
			new this(Atem),
			new this(BlackmagicDecklink),
			new this(PNG)
		]

		return this._instances
	}
}

module.exports = OutputModule
