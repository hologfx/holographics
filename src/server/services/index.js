const pluralize = require("pluralize")

class Service {
	constructor(name, path, methods) {
		this.name = name
		this.singularname = pluralize.singular(name)
		this.pluralname = pluralize(name)
		this.path = path || "/"
		this.methods = methods || require(`./${name.toLowerCase()}`)
		this.events = this.methods.events || []
		this.emitter = this.methods.emitter || {}
		delete this.methods.events
		delete this.methods.emitter
	}

	mount() {
		this.transports.forEach(transport => {
			transport.setup(this, this.path)
		})
	}

	static use(transport) {
		this.prototype.transports = this.prototype.transports || []
		this.prototype.transports.push(transport)
	}

	static mount(service, path) {
		this.prototype.transports.forEach(transport => {
			transport.setup(service, path)
		})
	}

	static get list() {
		return [
			new Service("Debug", "/debug"),
			new Service("Log", "/log"),
			new Service("Fonts", "/fonts"),
			new Service("Status", "/status"),
			new Service("State", "/state"),
			new Service("Themes", "/themes"),
			new Service("Palettes", "/palettes"),
			new Service("Animations", "/animations"),
			new Service("MediaFiles", "/mediafiles"),
			new Service("Widgets", "/widgets"),
			new Service("Entries", "/entries"),
			new Service("Outputs", "/outputs"),
			new Service("WidgetModules", "/widgetmodules"),
			new Service("OutputModules", "/outputmodules"),
			new Service("Settings", "/settings"),
			new Service("Update", "/update")
		]
	}

	static get all() {
		const services = {}
		this.list.forEach(s => {
			services[s.name] = s
		})
		return services
	}
}

module.exports = Service
