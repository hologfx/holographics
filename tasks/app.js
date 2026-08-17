const currentVersion = require("../package.json").version
const changelog = require("./changelog")

const { renderToMessage, renderChangelogs } = require("./render")

const term = require("terminal-kit").terminal

var logo =
	"\n _   _       _                             _     _          \n| | | |     | |                           | |   (_)         \n| |_| | ___ | | ___   __ _ _ __ __ _ _ __ | |__  _  ___ ___ \n|  _  |/ _ \\| |/ _ \\ / _` | '__/ _` | '_ \\| '_ \\| |/ __/ __|\n| | | | (_) | | (_) | (_| | | | (_| | |_) | | | | | (__\\__ \\\n|_| |_/\\___/|_|\\___/ \\__, |_|  \\__,_| .__/|_| |_|_|\\___|___/\n                      __/ |         | |                     \n                     |___/          |_|                     \n"

term(logo)
term.windowTitle("Holographics Release Tool")

function get_notify_message() {
	return renderToMessage(changelog.get(currentVersion))
}

function menu() {
	term("What do you want to do?\n")

	term.singleColumnMenu(
		[
			"Write changelog",
			"Render CHANGELOG.md",
			"Get notification message for last changelog",
			"Release"
		],
		function(error, response) {
			if (error) throw error
			switch (response.selectedIndex) {
				case 0:
					want_to_add_a_changelog()
					break
				case 1:
					render_changelogs()
					break
				case 2:
					term(
						`\n\nMESSAGE FOLLOWS\n\n${get_notify_message()}\n\nEND OF MESSAGE\n`
					)
					menu()
					break
				case 3:
					process.exit()
					break
			}
		}
	)
}

async function render_changelogs() {
	await renderChangelogs()
	term.green("\nChangelog.md and release-notes.md updated\n")
	menu()
}

async function want_to_add_a_changelog() {
	if (changelog.get(currentVersion)) {
		term.red(
			"Looks like a changelog is already made for this version. Do you want to overwrite it? [Y|n]\n"
		)
	} else {
		await make_changelog()
	}

	if (await term.yesOrNo({ yes: ["y"], no: ["n"] }).promise) {
		await make_changelog()
	} else {
		menu()
	}
}

var changelogEntry = {}

async function make_changelog() {
	changelogEntry.version = currentVersion
	changelogEntry.date = Date.now()

	term("\nPlease enter changelog header: \n")
	changelogEntry.header = await term.inputField({}).promise

	term("\nPlease enter changelog description: \n")
	changelogEntry.description = await term.inputField({}).promise

	const changeLogItemTypes = [
		"FEATURE",
		"FIXED",
		"CHANGED",
		"IMPROVED",
		"PERFORMANCE",
		"DEPRECATED",
		"BREAKING CHANGE",
		"KNOWN ISSUE"
	]

	changelogEntry.items = []

	async function another_item() {
		if (await term.yesOrNo({ yes: ["y"], no: ["n"] }).promise) {
			await add_item()
		} else {
			term.green("\nChangelog saved! \n")
			changelog.set(currentVersion, changelogEntry)
			await render_changelogs()
		}
	}

	async function add_item() {
		const { selectedText } = await term.singleColumnMenu(changeLogItemTypes)
			.promise
		const newEntry = {
			type: selectedText
		}

		term("\nPlease enter changelog item description: \n")
		newEntry.description = await term.inputField({}).promise
		changelogEntry.items.push(newEntry)
		term.green("\nAnother item? [Y|n]\n")
		await another_item()
	}

	term.green("\nAdd a release item? [Y|n]\n")
	await another_item()
}

menu()
