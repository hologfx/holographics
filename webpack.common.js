const path = require("path")
const webpack = require("webpack")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const CopyPlugin = require("copy-webpack-plugin")

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const fs = require("fs")
const semver = require("semver")

// The Updates page shows the whole history for the running build's channel, the
// way the old generated release-notes.md did. release-please keeps a changelog
// per channel; pick the one matching this build and inline it.
const prerelease = semver.prerelease(require("./package.json").version)
const changelogFile = prerelease ? `CHANGELOG-${prerelease[0]}.md` : "CHANGELOG.md"
const changelog = fs.existsSync(changelogFile)
	? fs.readFileSync(changelogFile, "utf8")
	: ""
const smp = new SpeedMeasurePlugin()

module.exports = smp.wrap({
	context: __dirname,
	entry: {
		control: "./src/client/control.js",
		control_style: "./src/client/control/assets/scss/main.scss",
		render: "./src/client/render.js",
		render_style: "./src/client/render/scss/render.scss"
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "./dist/client"),
		publicPath: "/"
	},
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader"
			},
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.pug$/,
				loader: "pug-plain-loader"
			},
			{
				test: /\.js$/,
				loader: "babel-loader",
				// exclude: /node_modules/,
				options: {
					cacheDirectory: true,
					presets: ["@babel/preset-env"],
					plugins: ["@babel/plugin-syntax-dynamic-import"]
				}
			}
		]
	},
	resolve: {
		extensions: [".js", ".vue", ".scss"],
		alias: {
			vue$: "vue/dist/vue.esm.js",
			"@": path.join(__dirname, "src/client/control/")
		}
	},
	plugins: [
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			__CHANGELOG__: JSON.stringify(changelog)
		}),
		new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			moment: "moment",
			io: "socket.io-client"
		}),
		new CopyPlugin({
			patterns: [
				{ from: "./src/client/public", to: "./public" },
				{ from: "./src/client/views", to: "./views" }
			]
		})
	]
})
