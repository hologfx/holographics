const EventEmitter = require("events")
const db = require("./db")

const { Logger } = require("./logging")
const logging = new Logger("lib/state")

const _ = require("lodash")

const state = new EventEmitter()

state.current = {}

state.get = function() {
	state.current = db.read().value()
	return state.current
}

// Debounced state update notification sender
state.emit_changed = _.debounce(
	() => {
		state.emit("stateChanged", state.get())
		const activeTheme = ThemeDir.items.find(
			t => t.filename === state.current.style.activeTheme
		)
		if (activeTheme) activeTheme.updateRender()
	},
	50,
	{
		trailing: true
	}
)

state.update = function(change) {
	const oldState = db.cloneDeep().value()
	logging.log(JSON.stringify(change))
	if (db.merge(change).write()) {
		if (!db.isEqual(oldState, db.getState()).value()) {
			state.get()
			state.emit_changed()

			logging.log("State set", { type: logging.TYPES.SUCCESS })
			return state.current
		} else {
			return state.current
		}
	} else {
		return false
	}
}

state.set = function(change) {
	const oldState = db.cloneDeep().value()
	logging.log(JSON.stringify(change))
	if (db.assign(change).write()) {
		if (!db.isEqual(oldState, db.get().value()).value()) {
			state.get()
			state.emit_changed()
			logging.log("State set", { type: logging.TYPES.SUCCESS })

			return state.current
		} else {
			return state.current
		}
	} else {
		return false
	}
}

state.reset = function() {
	try {
		db.setState({}).write()
		db.setDefaults()
		logging.log("State reset to defaults", { type: logging.TYPES.SUCCESS })
		state.emit_changed()
		return state.get()
	} catch (e) {
		return e
	}
}

module.exports = state
