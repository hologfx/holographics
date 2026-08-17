require("../test_scaffold")
const fs = require("fs")
const path = require("path")

describe("media_files", function() {
	it(".all() returns all media files", async function() {
		const mediafiles = await MediaFile.all()
		expect(mediafiles).to.be.an("array")
		expect(mediafiles[0]).to.have.property("filename")
	})

	it("finds a media file by filename", async function() {
		const holologo = await MediaFile.findByFilename("holographics_logo.png")
		expect(holologo.filetype.ext).to.equal("png")
	})

	it("does not return a file that does not exist", async function() {
		const doesNotExist = await MediaFile.findByFilename("testfile5.txt")
		expect(doesNotExist).to.equal(undefined)
	})

	context("with new file", function() {
		after(function() {
			fs.unlinkSync(path.join(user_data_dir, "mediafiles", "testfile.txt"))
		})

		it("automatically finds a newly created file", async function() {
			const mediaFilesChanged = new Promise(resolve => {
				MediaFile.prototype.once("mediaFilesChanged", resolve)
			})

			fs.writeFileSync(
				path.join(user_data_dir, "mediafiles", "testfile.txt"),
				"Test"
			)

			await mediaFilesChanged

			const testfile = await MediaFile.findByFilename("testfile.txt")
			expect(testfile.filename).to.equal("testfile.txt")
		})
	})
})
