require("../test_scaffold")

describe("widget_modules", function() {
	it(".all returns all widget modules", async function() {
		const widgetModules = await WidgetModuleDir.all()
		expect(widgetModules).to.be.an("array")
		expect(widgetModules[0]).to.have.property("slug")
	})

	it("finds a widget module by slug", async function() {
		const broadcastMessage = await WidgetModule.findBySlug("BroadcastMessage")
		expect(broadcastMessage.name).to.equal("Broadcast Message")
	})

	it("renders pug to html", async function() {
		const broadcastMessage = await WidgetModule.findBySlug("BroadcastMessage")
		expect(broadcastMessage.vue_template).to.be.an("string")
	})
})
