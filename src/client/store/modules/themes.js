import _ from "lodash"

import Holographics from "../../control/lib/holographics-client"

export default {
	state: [],
	getters: {
		getThemeByFilename: state => filename => {
			return state.find(theme => theme.filename === filename)
		},
		getActiveThemeCSS: (state, getters, rootState, rootGetters) => {
			if (rootGetters.readyToRender)
				return getters.getThemeByFilename(rootState.style.activeTheme).rendered
			return ""
		}
	},
	mutations: {
		SET_THEMES(state, themes) {
			_.assign(state, themes)
		},
		REMOVE_THEME(state, filename) {
			const index = state.findIndex(theme => theme.filename === filename)
			state.splice(index, 1)
		},
		UPDATE_THEME(state, newTheme) {
			const index = state.findIndex(
				theme => theme.filename === newTheme.filename
			)
			state[index] = newTheme
		}
	},
	actions: {
		async getThemes({ commit }) {
			const themes = await Holographics.themes.find()
			commit("SET_THEMES", themes)
			return themes
		},
		async updateTheme({ commit }, { filename, contents }) {
			const theme = await Holographics.themes.update({
				id: filename,
				data: { contents }
			})
			commit("UPDATE_THEME", theme)
			return theme
		},
		async removeTheme({ commit, dispatch }, filename) {
			const theme = await Holographics.themes.remove({
				id: filename
			})
			commit("REMOVE_THEME", filename)
			return theme
		}
	}
}
