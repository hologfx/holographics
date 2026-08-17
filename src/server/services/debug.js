module.exports = {
	get() {
		const development = process.env.NODE_ENV
		return {
			development,
			appMode: global.appMode
		}
	},
	setAppMode(data) {
		if (process.env.NODE_ENV === "production") throw Error("Not allowed")
		if (data.environment !== undefined)
			global.appMode.environment = data.environment
		if (data.packed !== undefined) global.appMode.packed = data.packed
		if (data.development !== undefined)
			global.appMode.development = data.development
		return global.appMode
	}
}
