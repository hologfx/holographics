const path = require("path")
const webpack = require("webpack")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const CopyPlugin = require("copy-webpack-plugin")

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
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
