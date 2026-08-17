import Vue from "vue"
import Vuex from "vuex"

import palettes from "./modules/palettes"
import style from "./modules/style"
import widgets from "./modules/widgets"
import entries from "./modules/entries"
import themes from "./modules/themes"
import mediafiles from "./modules/mediafiles"
import updates from "./modules/updates"
import outputs from "./modules/outputs"

import Holographics from "../control/lib/holographics-client"

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		palettes,
		style,
		widgets,
		themes,
		entries,
		mediafiles,
		updates,
		outputs
	},
	state: {
		connected: false,
		committing: false,
		status: {},
		widgetModules: [],
		entries: [],
		activePalette: [],
		settings: {},
		animations: [],
		outputs: [],
		outputModules: [],
		debug: {},
		updates: {}
	},
	getters: {
		getWidgetModule: state => type => {
			return state.widgetModules.find(
				widgetModule => type === widgetModule.slug
			)
		},
		getOutputModule: state => type => {
			return state.outputModules.find(
				outputModule => type === outputModule.slug
			)
		},
		getWidgetCSS: state => {
			return state.widgetModules
				.map(widgetModule => widgetModule.css)
				.join("\n")
		},
		readyToRender: state => {
			if (Object.entries(state.widgetModules).length === 0) return false
			if (Object.entries(state.settings).length === 0) return false
			if (Object.entries(state.status).length === 0) return false
			if (Object.entries(state.themes).length === 0) return false
			if (Object.entries(state.animations).length === 0) return false
			if (Object.entries(state.debug).length === 0) return false
			return true
		}
	},
	mutations: {
		SOCKET_stateChanged: (state, received) => {
			Vue.set(state, "style", received.style)
			Vue.set(state, "widgets", received.widgets)
			Vue.set(state, "entries", received.entries)
			Vue.set(state, "palettes", received.palettes)
			Vue.set(state, "activePalette", received.activePalette)
		},
		SOCKET_connect: state => {
			Vue.set(state, "connected", true)
		},
		SOCKET_disconnect: state => {
			Vue.set(state, "connected", false)
		},
		SOCKET_outputsChanged: (state, outputs) => {
			Vue.set(state, "outputs", outputs)
		},
		SOCKET_outputmodulesChanged: (state, outputModules) => {
			Vue.set(state, "outputModules", outputModules)
		},
		SOCKET_statusChanged: (state, status) => {
			Vue.set(state, "status", status)
		},
		SOCKET_themesChanged: (state, themes) => {
			Vue.set(state, "themes", themes)
		},
		SOCKET_animationsChanged: (state, animations) => {
			Vue.set(state, "animations", animations)
		},
		SOCKET_mediaFilesChanged: (state, mediafiles) => {
			Vue.set(state, "mediafiles", mediafiles)
		},
		SOCKET_widgetModulesChanged: (state, widgetModules) => {
			Vue.set(state, "widgetModules", widgetModules)
		},
		commitStatus: (state, status) => {
			state.committing = status
		},
		widgetmodules: (state, received) => {
			Vue.set(state, "widgetModules", received)
		},
		outputs: (state, received) => {
			Vue.set(state, "outputs", received)
		},
		outputmodules: (state, received) => {
			Vue.set(state, "outputModules", received)
		},
		settings: (state, received) => {
			Vue.set(state, "settings", received)
		},
		mediafiles: (state, received) => {
			Vue.set(state, "mediafiles", received)
		},
		status: (state, status) => {
			Vue.set(state, "status", status)
		},
		themes: (state, themes) => {
			Vue.set(state, "themes", themes)
		},
		animations: (state, animations) => {
			Vue.set(state, "animations", animations)
		},
		debug: (state, debug) => {
			Vue.set(state, "debug", debug)
		}
	},
	actions: {
		SOCKET_connect(context) {
			context.dispatch("getInitialState")
		},
		async getInitialState(context) {
			const state = await Holographics.state.get()
			context.commit("SOCKET_stateChanged", state)

			const widgetmodules = await Holographics.widgetmodules.get()
			context.commit("widgetmodules", widgetmodules)

			const outputs = Holographics.outputs.find()
			const outputmodules = Holographics.outputmodules.get()
			const settings = Holographics.settings.get()
			const mediafiles = Holographics.mediafiles.get()
			const status = Holographics.status.get()
			const themes = Holographics.themes.find()
			const animations = Holographics.animations.get()
			const debug = Holographics.debug.get()

			context.commit("outputs", await outputs)
			context.commit("outputmodules", await outputmodules)
			context.commit("settings", await settings)
			context.commit("mediafiles", await mediafiles)
			context.commit("status", await status)
			context.commit("themes", await themes)
			context.commit("animations", await animations)
			context.commit("debug", await debug)

			return true
		},
		getState(context) {
			Holographics.state.get().then(response => {
				context.commit("SOCKET_state", response)
			})
		},
		updateState(context, update) {
			Holographics.state.patch({ data: update }).then(response => {
				context.commit("SOCKET_stateChanged", response)
			})
		},
		updateSetting(context, update) {
			Holographics.settings.patch({ data: update }).then(response => {
				context.commit("settings", response)
			})
		},
		setState(context, update) {
			Holographics.state.update({ data: update }).then(response => {
				context.commit("SOCKET_stateChanged", response)
			})
		},
		reset_config(context) {
			Holographics.state.remove().then(received => {
				context.commit("SOCKET_stateChanged", received)
			})
		},
		reset_themes(context) {
			Holographics.themes.reset().then(themes => {
				context.commit("themes", themes)
			})
		},
		reset_widgets(context) {
			Holographics.widgetmodules.reset().then(widgetmodules => {
				context.commit("widgetmodules", widgetmodules)
			})
		},
		reset_animations(context) {
			Holographics.animations.reset().then(animations => {
				context.commit("animations", animations)
			})
		}
	}
})
