// If we startup as an Electron app, these could already be set.
global.path_to_app = global.path_to_app || "./"
global.base_dir = global.base_dir || __dirname
global.user_data_dir = global.user_data_dir || "./user_data"

if (!global.appMode) {
	global.appMode = {
		environment: "node",
		packed: process.env.APP_ENV === "packed",
		development: !(process.env.NODE_ENV === "production")
	}
}

// Initializes models in the global scope
require("../src/server/models").globalize()

const Service = require("../src/server/services")

var repl = require("repl")

console.log(" _   _       _              __       ______ ___________ _     ")
console.log("| | | |     | |            / _|      | ___ \\  ___| ___ \\ |    ")
console.log("| |_| | ___ | | ___   __ _| |___  __ | |_/ / |__ | |_/ / |    ")
console.log(
	"|  _  |/ _ \\| |/ _ \\ / _\\ |  _\\ \\/ / |    /|  __||  __/| |    "
)
console.log("| | | | (_) | | (_) | (_| | |  >  <  | |\\ \\| |___| |   | |____")
console.log(
	"\\_| |_/\\___/|_|\\___/ \\__, |_| /_/\\_\\ \\_| \\_\\____/\\_|   \\_____/"
)
console.log("                      __/ |                                   ")
console.log("                     |___/                                    ")

console.log(
	"This is the Holographics interactive terminal. All Holographics global models, like Widget and Entry, are available. You can also reach the Service API layer directly via the Services global var."
)
console.log("Type .exit to, well, exit.")

const terminal = repl.start("hologfx > ")
terminal.context.Services = Service.all
