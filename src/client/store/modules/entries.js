import Holographics from "../../control/lib/holographics-client"

export default {
	state: [],
	getters: {
		isVisibleEntry: (state, getters) => (entry, visibleEntries) => {
			return visibleEntries.find(visibleEntry => entry.id === visibleEntry.id)
		},
		getEntryById: state => id => {
			return state.find(entry => entry.id === id)
		},
		getEntriesByWidgetId: state => widgetId => {
			return state.filter(entry => entry.widgetId === widgetId)
		}
	},
	actions: {
		createEntry({ commit }, { data }) {
			commit("commitStatus", true)
			Holographics.entries.create({ data }).then(() => {
				commit("commitStatus", false)
			})
		},
		updateEntry({ commit }, { id, data }) {
			commit("commitStatus", true)
			Holographics.entries.update({ id, data }).then(() => {
				commit("commitStatus", false)
			})
		},
		removeEntry({ commit }, id) {
			commit("commitStatus", true)
			Holographics.entries.remove({ id }).then(() => {
				commit("commitStatus", false)
			})
		}
	}
}
