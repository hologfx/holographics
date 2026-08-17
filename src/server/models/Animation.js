// Models
const BaseDirFileModel = require("./BaseDirFileModel")
const AnimationDir = require("./AnimationDir")

class Animation extends BaseDirFileModel {
	constructor(filename, dir, options) {
		super(filename, dir, options)

		if (this.contents) {
			let newAnimationFunction = this.contents.replace(
				`export default {`,
				`function animationFunction() { return {`
			)
			newAnimationFunction += `} animationFunction()`
			this.contents = newAnimationFunction
		}
	}

	static async all() {
		return AnimationDir.all()
	}

	static async findByFilename(filename) {
		return AnimationDir.findByFilename(filename)
	}
}

AnimationDir.on("directoryChanged", event => {
	Animation.prototype.emit("animationsChanged", AnimationDir.items)
})

module.exports = Animation
