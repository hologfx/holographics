const scaffold = require("../test_scaffold")
const baseUrl = scaffold.baseUrl

var testURLs = ["/render/", "/control/"]

describe("router_test", function() {
	describe("application pages should return status 200", function() {
		// We raise the timeout so the server has time to start
		for (const url of testURLs) {
			it(baseUrl + url + " should return status 200", async function() {
				this.timeout(5000)
				const response = await axios.get(baseUrl + url)
				expect(response).to.have.property("status", 200)
			})
		}
	})
})
