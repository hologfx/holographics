const merge = require("webpack-merge")
const common = require("./webpack.common.js")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

var webpack = require("webpack")

module.exports = merge(common, {
	mode: "production",
	performance: {
		hints: false
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		}),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: '"production"'
			}
		})
	]
})
