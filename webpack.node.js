const webpack = require("webpack")
const path = require("path")
const nodeExternals = require("webpack-node-externals")

const CopyWebpackPlugin = require("copy-webpack-plugin")

var fs = require("fs")
var gracefulFs = require("graceful-fs")
gracefulFs.gracefulify(fs)

module.exports = {
	mode: "production",
	entry: "./src/entry_server.js",
	target: "node",
	devtool: "source-map",
	output: {
		path: path.resolve(__dirname, "./dist/server"),
		publicPath: path.resolve(__dirname, "./src/server/"),
		filename: "server.js"
	},
	optimization: {
		minimize: false,
		nodeEnv: "production"
	},
	externals: [
		// native addon — must stay external (never bundled by webpack)
		"macadam",
		nodeExternals({
			whitelist: ["validate.js", "country-list", "debug", "esm", "jsvat"]
		})
	],
	// devtool: 'source-map',
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
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: "./src/assets",
					to: "./assets"
				}
			]
		})
	]
}
