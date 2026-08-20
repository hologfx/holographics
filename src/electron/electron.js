const { shell, app, Menu, BrowserWindow, dialog } = require("electron")
const settings = require("../server/lib/settings")
const status = require("../server/lib/status")
const { current } = require("../server/lib/state")

let splash, mainWindow

function createSplashScreen() {
	const startupScreen = require("./splash")

	splash = new BrowserWindow({
		width: 500,
		height: 281,
		frame: false,
		center: true,
		show: false,
		title: "Holographics",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,

		}
	})

	splash.loadURL(
		"data:text/html;charset=UTF-8," + encodeURIComponent(startupScreen)
	)

	splash.once("ready-to-show", () => {
		splash.show()
		const currentStatus = status.get()

		splash.webContents.send("version", currentStatus.version)
		if (
			currentStatus.version.search("alpha") > 0 ||
			currentStatus.version.search("beta") > 0
		) {
			splash.webContents.send("build", "DEVELOPMENT VERSION")
		} else {
			splash.webContents.send("build", "PRODUCTION VERSION")
		}

		let i = 0
		let queue = -1
		process.on("startupStatus", status => {
			queue++
			console.log(status + queue)
			setTimeout(() => {
				queue--
				try {
					i = i + 11.1
					splash.webContents.send("status", { message: status, percent: i })
				} catch (e) { }
			}, queue * 200)
		})
		splash.showInactive()

		process.emit("splashScreenUp")
	})
}

function createMainWindow(port) {
	const window = settings.get("window").value() || {
		width: 1280,
		height: 800
	}
	port = port || 3000

	mainWindow = new BrowserWindow({
		show: false,
		...window,
		title: "Holographics Control",
		webPreferences: {
			nodeIntegration: true,
			nativeWindowOpen: true
		}
	})

	mainWindow.loadURL(`http://127.0.0.1:${port}/`)

	// When we close the application get the sizes and positions and store them
	mainWindow.on("close", () => {
		settings.read()
		settings.set("window", mainWindow.getBounds()).write()
	})

	// This prevents new windows from opening based on browser events
	// Instead they will open in the native browser, thereby enabling
	// us to open browser windows with target _blank.
	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
		return { action: 'deny' };
	});

	// Same-window navigations bypass the handler above, so a plain link in the
	// release notes would replace the control panel with the linked page.
	mainWindow.webContents.on("will-navigate", (event, url) => {
		if (!url.startsWith(`http://127.0.0.1:${port}/`)) {
			event.preventDefault()
			shell.openExternal(url)
		}
	})

	mainWindow.once("ready-to-show", () => {
		splash.destroy()
		splash = null
		mainWindow.show()

		const menutemplate = Menu.buildFromTemplate(
			require("./menu")(app, mainWindow)
		)
		Menu.setApplicationMenu(menutemplate)
	})
}

app.on("ready", () => {
	createSplashScreen()
})
process.on("finishedStartup", createMainWindow)

// Quit when all windows are closed.
app.on("window-all-closed", function () {
	app.exit()
})

process.on("uncaughtException", function (error) {
	console.log("Handling uncaught exception", error)

	// This funky oneliner gets the name of the file to display to the user
	var readableError =
		error +
		"\n(at: " +
		error.stack
			.split("\n")
			.slice(1, 2)[0]
			.split("/")
			.slice(-1)

	try {
		dialog.showErrorBox(
			"Fatal error",
			"Floris should be chewed out for being a bad programmer.\nYou wanna help the guy out, tell him:\n" +
			readableError
		)
	} catch (e) {
		dialog.showErrorBox("Fatal error", readableError)
	} finally {
		app.exit()
	}
})

module.exports = app
