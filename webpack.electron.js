const webpack = require("webpack")
const path = require("path")
const nodeExternals = require("webpack-node-externals")

module.exports = {
	mode: "production",
	entry: "./src/entry_electron.js",
	devtool: "source-map",
	target: "electron-main",
	output: {
		path: path.resolve(__dirname, "./dist/server"),
		publicPath: path.resolve(__dirname, "./dist/server/"),
		filename: "electron.js"
	},
	optimization: {
		minimize: false,
		nodeEnv: "production"
	},
	externals: [
		nodeExternals({
			whitelist: ["validate.js", "country-list", "debug", "esm", "jsvat"]
		})
	],
	node: {
		console: false,
		global: false,
		process: false,
		__filename: true,
		__dirname: false,
		Buffer: false,
		setImmediate: false
	},
	resolve: {
		alias: {
			stylus$: "stylus/lib/stylus"
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				APP_ENV: JSON.stringify("packed")
			}
		})
	]
}
