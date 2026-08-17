import Holographics from "../../control/lib/holographics-client"

export default {
	state: [],
	getters: {
		getPaletteById: state => id => {
			return state.find(palette => palette.id === id)
		}
	},
	actions: {
		activatePalette({ getters, dispatch }, palette) {
			dispatch("updateState", {
				activePalette: getters.getPaletteById(palette.id).colors
			})
		},
		createPalette({ commit }, palette) {
			Holographics.palettes.create({ data: palette })
		},
		updatePalette({ commit }, newPalette) {
			Holographics.palettes.update({ id: newPalette.id, data: newPalette })
		},
		removePalette({ commit }, palette) {
			Holographics.palettes.remove({ id: palette.id })
		}
	}
}
