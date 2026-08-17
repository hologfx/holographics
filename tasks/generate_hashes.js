const crypto = require("crypto")
const fs = require("fs-extra")
const path = require("path")
const appVersion = require("../package.json").version

const assetsToTrack = ["widgets", "mediafiles", "themes", "animations"]

const assetsPath = "./src/assets"

const hashes = JSON.parse(
	fs.readFileSync(path.join(assetsPath, "hashes.json")).toString()
)

assetsToTrack.forEach(asset => {
	// Read the contents of the app directory from disk
	let dirContents = fs.readdirSync(path.join(assetsPath, asset))

	// Filter out all hidden files and folders from the result
	dirContents = dirContents.filter(
		itemPath => !/(^|\/)\.[^\/\.]/g.test(itemPath)
	)

	dirContents.forEach(itemPath => {
		let contents
		try {
			contents = fs.readFileSync(path.join(assetsPath, asset, itemPath))
		} catch (e) {
			try {
				contents = fs.readFileSync(
					path.join(assetsPath, asset, itemPath, "/index.js")
				)
			} catch (e) {}
		}
		const md5 = crypto
			.createHash("md5")
			.update(contents)
			.digest("hex")
		if (!hashes.find(hash => hash.md5 === md5)) {
			hashes.push({ file: `${asset}/${itemPath}`, md5, version: appVersion })
		}
	})
})

fs.writeFileSync(
	path.join(assetsPath, "hashes.json"),
	JSON.stringify(hashes, null, "\t")
)

console.log(hashes)
