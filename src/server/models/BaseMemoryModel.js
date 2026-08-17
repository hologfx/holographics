const pluralize = require("pluralize")
const EventEmitter = require("events").EventEmitter

class BaseMemoryModel extends EventEmitter {
  constructor(values) {
    super()
    Object.assign(this, values)

    if (this.name && !this.slug) {
      this.slug = this.name.replace(/\s/g, "")
    }
  }

	static get _modelname() {
		return this.prototype.constructor.name.toLowerCase()
	}

	static get _pluralmodelname() {
		return pluralize(this._modelname)
	}

  static emitChanged() {
		this.prototype.emit(`${this._pluralmodelname}Changed`, this.all)
  }

  static get _instances() {
		return this.prototype.constructor.instances
	}

	static set _instances(value) {
		this.prototype.constructor.instances = value
  }
  
  static get all() {
    return this._instances
  }
  
  static findBySlug(slug) {
		return this.all.find(w => w.slug === slug)
	}
}

module.exports = BaseMemoryModel