import Holographics from "../../control/lib/holographics-client"

export default {
	state: [],
	getters: {
		stillOutputs(state, getters, rootState, rootGetters) {
			return state.filter(output => {
				const outputModule = rootGetters.getOutputModule(output.type)
				return outputModule.renders.stills
			})
		}
	},
	actions: {
		createOutput({ commit }, { data }) {
			commit("commitStatus", true)
			Holographics.outputs.create({ data }).then(() => {
				commit("commitStatus", false)
			})
		},
		updateOutput({ commit }, { id, data }) {
			commit("commitStatus", true)
			Holographics.outputs.update({ id, data }).then(() => {
				commit("commitStatus", false)
			})
		},
		removeOutput({ commit }, id) {
			commit("commitStatus", true)
			Holographics.outputs.remove({ id }).then(() => {
				commit("commitStatus", false)
			})
		}
	}
}
