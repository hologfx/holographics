const fs = require("fs")

const cssFile = fs
	.readFileSync("./src/client/public/google_fonts/google_fonts.css")
	.toString()

const fonts = {}

cssFile.match(/font-family(.*)\n(.*)\n(.*)/g).forEach(font => {
	const fontFamily = font.split("font-family: '")[1].split("'")[0]

	const fontStyle = font.split("font-style: ")[1].split(";")[0]

	const fontWeight = font.split("font-weight: ")[1].split(";")[0]

	fonts[fontFamily] = fonts[fontFamily] || []

	fonts[fontFamily].push({
		family: fontFamily,
		style: fontStyle,
		weight: fontWeight
	})
})

fs.writeFileSync(
	"./src/server/public/google_fonts/google_fonts.json",
	JSON.stringify(fonts)
)
