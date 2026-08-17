const { renderChangelogs } = require("./render")

renderChangelogs().then(() => {
	console.log("Rendered changelogs")
	process.exit(0)
})
