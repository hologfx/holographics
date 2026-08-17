const merge = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
	mode: "development",
	devServer: {
		publicPath: "/client/",
		progress: true,
		contentBase: false,
		serveIndex: true
	},
	optimization: {
		minimize: false
	}
})
