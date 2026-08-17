const db = require("../lib/db")
const state = require("../lib/state")
const pluralize = require("pluralize")
const _ = require("lodash")
const randtoken = require("rand-token")
const EventEmitter = require("events").EventEmitter

class BaseDBModel extends EventEmitter {
	constructor(values) {
		super()
		Object.assign(this, values)

		// Setting up Parent > Child relationships
		if (this.has_many) {
			for (const Childmodel of this.has_many) {
				// This allows you to do parent.children
				Object.defineProperty(this, Childmodel._pluralmodelname, {
					get: function() {
						return Childmodel.all().filter(
							instance => instance[`${this._modelname}Id`] === this.id
						)
					}
				})

				// This allows you to do parent.create_child
				this[`create_${Childmodel._modelname}`] = values => {
					return Childmodel.create({
						[`${this._modelname}Id`]: this.id,
						...values
					})
				}
			}
		}

		// Make sure this new instance is stored in memory instances
		const memoryItem = this.constructor._instances.find(
			instance => this.id === instance.id
		)
		if (!memoryItem) {
			this.constructor._instances.push(this)
		}
	}

	get _db() {
		return db.get(this._pluralmodelname)
	}

	static emitChanged() {
		this.prototype.emit(`${this.prototype._pluralmodelname}Changed`, this.all())
	}

	static get _db() {
		return db.get(this._pluralmodelname)
	}

	static get _modelname() {
		return this.prototype.constructor.name.toLowerCase()
	}

	static get _pluralmodelname() {
		return pluralize(this._modelname)
	}

	static get _instances() {
		return this.prototype.constructor.instances || []
	}

	static set _instances(value) {
		this.prototype.constructor.instances = value
	}

	get _modelname() {
		return this.constructor.name.toLowerCase()
	}

	get _pluralmodelname() {
		return pluralize(this._modelname)
	}

	static all() {
		const all = this._db.value() || []
		this._instances = this._instances || []

		// Add any new instances that might have been added to the database
		for (const instance of all) {
			// Only if this instance is not already present in memory
			if (!this._instances.some(e => e.id === instance.id)) {
				// Create a memory instance
				// eslint-disable-next-line no-new
				new this(instance)
			}
		}

		// Remove any instances that might have been removed from the database
		for (const instance of this._instances) {
			// If the ID of this instance is not present in the database...
			if (!all.some(e => e.id === instance.id)) {
				// Remove the instance from memory
				console.log(
					`Destroying memory instance for ${this._modelname}: ${instance.id}`
				)
				this._instances = this._instances.filter(e => e.id !== instance.id)
			}
		}

		return this._instances
	}

	static findById(id) {
		return this.all().find(instance => instance.id === id)
	}

	static create(values) {
		const item = new this(values).save() || false
		if (item.afterCreate) item.afterCreate()
		return item
	}

	filterForTransport() {
		const filtered = {}

		this.serverOnlyKeys = new Set(this.serverOnlyKeys)

		this.serverOnlyKeys.add("persistKeys")
		this.serverOnlyKeys.add("serverOnlyKeys")
		this.serverOnlyKeys.add("has_many")
		this.serverOnlyKeys.add("_events")
		this.serverOnlyKeys.add("_eventsCount")
		this.serverOnlyKeys.add("_maxListeners")

		this.serverOnlyKeys = [...this.serverOnlyKeys]

		Object.keys(this).forEach(key => {
			if (!this.serverOnlyKeys.includes(key)) filtered[key] = this[key]
		})

		return filtered
	}

	filterForPersist() {
		const saveAbleObject = {}
		if (this.persistKeys) {
			this.persistKeys = new Set(this.persistKeys)
			this.persistKeys.add("id")
			this.persistKeys = [...this.persistKeys]

			this.persistKeys.forEach(persistKey => {
				saveAbleObject[persistKey] = this[persistKey]
			})
			return saveAbleObject
		} else {
			return this
		}
	}

	save() {
		if (this.beforeSave) this.beforeSave()
		db.read()
		if (this._db.find({ id: this.id }).value()) {
			this._db.replaceById(this.id, this.filterForPersist()).write()
		} else {
			this.id = randtoken.generate(
				16,
				"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
			)
			this._db.push(this.filterForPersist()).write()
		}
		this.constructor.emitChanged()
		state.emit_changed()
		return this
	}

	update(values) {
		_.assign(this, values)
		this.save()
		return this
	}

	patch(values) {
		_.merge(this, values)
		this.save()
		return this
	}

	remove() {
		if (this.has_many) {
			for (const childmodel of this.has_many) {
				this[childmodel._pluralmodelname].forEach(child => child.remove())
			}
		}
		this._db.remove({ id: this.id }).write()
		this.constructor.emitChanged()
		state.emit_changed()
		return this
	}
}

module.exports = BaseDBModel
