const render = {}
const moment = require("moment")
const fs = require("fs")
const semver = require("semver")
const currentVersion = semver.parse(require("../package.json").version)

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

render.renderToMarkdown = function(changelogItem) {
	let markdown = ""

	const date = moment(changelogItem.date)

	// Title
	markdown += `# ${changelogItem.version} <span class='date'>${date.format(
		"YYYY-MM-DD"
	)}</span>\n\n`
	if (changelogItem.header) markdown += `## ${changelogItem.header}\n\n`
	if (changelogItem.description) markdown += `${changelogItem.description}\n\n`

	if (changelogItem.items.length === 0) return markdown

	changeLogItemTypes.forEach(type => {
		const filtered = changelogItem.items.filter(item => item.type === type)
		if (filtered.length > 0) {
			markdown += `### ${type}\n`
			markdown += `<ul class="${type}">\n`
			filtered.forEach(item => {
				markdown += `<li><span class="type ${item.type}">${item.type}</span>${
					item.description
				}</li>\n`
			})
			markdown += `</ul>\n\n`
		}
	})

	return markdown
}

render.renderToMessage = function(changelogItem) {
	let message = `*Version ${
		changelogItem.version
	} of Holographics has just been released! 🎉 *\nThe changelog reads as follows:\n`
	if (changelogItem.header) message += `**${changelogItem.header}**\n`
	if (changelogItem.description) message += `> ${changelogItem.description}\n\n`

	if (changelogItem.items.length === 0) return message

	changeLogItemTypes.forEach(type => {
		const filtered = changelogItem.items.filter(item => item.type === type)
		if (filtered.length > 0) {
			filtered.forEach(item => {
				message += ` • [${type}] ${item.description}\n`
			})
		}
	})

	return message
}

render.renderChangelogs = async function() {
	const changelogItems = JSON.parse(fs.readFileSync("./changelog.json"))
	let markdown = ""
	Object.keys(changelogItems)
		.reverse()
		.forEach(key => {
			const version = semver.parse(changelogItems[key].version)
			if (currentVersion.prerelease[0] === version.prerelease[0]) {
				markdown += render.renderToMarkdown(changelogItems[key])
				markdown += "\n"
			}
		})

	fs.writeFileSync("./CHANGELOG.md", markdown)
	fs.writeFileSync("./build/release-notes.md", markdown)
}

module.exports = render

// {
//  "1.0.0-alpha.6": {
//   "version": "1.0.0-alpha.6",
//   "date": 1549035992223,
//   "header": "Changelog fixer!",
//   "description": "This update is focussed entirely on changelogs.",
//   "items": [
//    {
//     "type": "FIXED",
//     "description": "We can now add more than one changelog item!"
//    },
//    {
//     "type": "FIXED",
//     "description": "See?!"
//    }
//   ]
//  }
// }
