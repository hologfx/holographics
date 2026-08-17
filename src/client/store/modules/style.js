import _ from "lodash"

import { Timer } from "@/util/utils"
const timer = new Timer(400)

export default {
	state: {},
	getters: {},
	mutations: {
		UPDATE_STYLE(state, newStyle) {
			state = _.merge(state, newStyle)
		}
	},
	actions: {
		updateStyle({ commit, dispatch }, newStyle) {
			commit("UPDATE_STYLE", newStyle)
			timer.update()
			timer.removeAllListeners("timer-finished")
			timer.once("timer-finished", () => {
				dispatch("updateState", { style: { ...newStyle } })
			})
		}
	}
}
