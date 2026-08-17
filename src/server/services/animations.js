const Animation = require("../models/Animation")
const AnimationDir = require("../models/AnimationDir")

module.exports = {
	emitter: Animation.prototype,
	events: {
		animationsChanged(result) {
			return result
		}
	},
	get() {
		return Animation.all()
	},
	async reset() {
		await AnimationDir.populateUserDir(true)
		return await Animation.all()
	}
}
