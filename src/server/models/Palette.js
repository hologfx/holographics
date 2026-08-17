// Models
const BaseDBModel = require("./BaseDBModel")

class Palette extends BaseDBModel {
	constructor(values) {
		if (typeof values !== "object")
			throw new Error("Must provide values object")

		values.name = values.name || ""
		values.colors = values.colors || []

		super(values)
	}
}

module.exports = Palette
