const electron = require("electron")
const settings = require("../server/lib/settings")

module.exports = (app, mainWindow) => {
	const HolographicsMenu = []

	if (settings.get("logging").value().level) {
		HolographicsMenu.push({
			label: "Open devtools",
			click: () => {
				mainWindow.webContents.openDevTools()
			}
		})
	}

	return [
		{
			label: "Holographics",
			submenu: [
				...HolographicsMenu,
				{
					label: "Open user data directory",
					click: () => {
						electron.shell.openPath(user_data_dir)
					}
				},
				{
					label: "Quit",
					accelerator: "CmdOrCtrl+Q",
					click: () => {
						app.quit()
					}
				}
			]
		},
		{
			label: "Edit",
			submenu: [
				{ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
				{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
				{ type: "separator" },
				{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
				{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
				{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
				{
					label: "Select All",
					accelerator: "CmdOrCtrl+A",
					selector: "selectAll:"
				}
			]
		},
		{
			label: "Help",
			submenu: [
				{
					label: "Source code & documentation",
					click: () => {
						electron.shell.openExternal("https://github.com/hologfx/holographics")
					}
				},
				{
					label: "Report an issue",
					click: () => {
						electron.shell.openExternal(
							"https://github.com/hologfx/holographics/issues"
						)
					}
				}
			]
		}
	]
}
