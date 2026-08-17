process.env.PORT = Math.floor(3001 + Math.random() * 1000)
process.env.NODE_ENV = "test"

const fs = require("fs-extra")
const path = require("path")

global.path_to_app = "./"
global.base_dir = path.join(__dirname, "../src")
global.user_data_dir = "./user_data"

fs.ensureDirSync(global.user_data_dir, 0o2775)
fs.ensureDirSync(path.join(global.user_data_dir, "/themes"), 0o2775)
fs.ensureDirSync(path.join(global.user_data_dir, "/widgets"), 0o2775)
fs.ensureDirSync(path.join(global.user_data_dir, "/mediafiles"), 0o2775)
fs.ensureDirSync(path.join(global.user_data_dir, "/animations"), 0o2775)

const db = require("../src/server/lib/db")
const settings = require("../src/server/lib/settings")
const state = require("../src/server/lib/state")
const assets = require("../src/server/lib/assets")

const models = require("../src/server/models")

const server = require("../src/server")

// Pretend you didn't see this part
global.expect = require("chai").expect
global.path = path
global.fs = require("fs")
global.axios = require("axios")

global.appMode = {
	environment: "test",
	packed: false,
	development: true
}

const scaffold = {}

scaffold.baseUrl = "http://localhost:" + process.env.PORT
scaffold.API_URI = scaffold.baseUrl + "/api/"

let DBState, settingsState, logfileState

scaffold.db_default_state = () => {
	DBState = fs.readFileSync(`${global.user_data_dir}/db.json`)
	settingsState = fs.readFileSync(`${global.user_data_dir}/settings.json`)
	logfileState = fs.readFileSync(`${global.user_data_dir}/holographics.log`)
	fs.unlinkSync(`${global.user_data_dir}/settings.json`)
	fs.unlinkSync(`${global.user_data_dir}/db.json`)
	fs.unlinkSync(`${global.user_data_dir}/holographics.log`)
	db.setState({}).write()
	db.setDefaults()
	db.read()
	settings.setState({}).write()
	settings.setDefaults()
	settings.read()
}

scaffold.restore_db_state = () => {
	fs.writeFileSync(`${global.user_data_dir}/settings.json`, settingsState)
	fs.writeFileSync(`${global.user_data_dir}/db.json`, DBState)
	fs.writeFileSync(`${global.user_data_dir}/holographics.log`, logfileState)
}

scaffold.create_a_widget = async () => {
	Widget.all()
	const widgetModules = await WidgetModuleDir.all()
	return Widget.create({ type: widgetModules[0].slug })
}

scaffold.db = db
scaffold.state = state
scaffold.Widget = models.all.Widget
scaffold.WidgetModule = models.all.WidgetModule

module.exports = scaffold

before(async function() {
	this.timeout(5000)
	models.globalize()
	await server.startHolographics()
	// await assets.populateDefaults()
	// await assets.watchFiles()
})

after(async function() {
	try {
		await assets.prototype.watcher.close()
	} catch (error) {}
})
