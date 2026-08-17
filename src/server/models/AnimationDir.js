const BaseDirModel = require("./BaseDirModel")

class AnimationDirectory extends BaseDirModel {
	constructor() {
		super({
			directory: "animations",
			textfiles: true
		})
	}

	processItem(filename) {
		return new Animation(filename, this.userAssetFolderPath, {
			textfiles: this.textfiles
		})
	}
}

const AnimationDir = new AnimationDirectory()

module.exports = AnimationDir
