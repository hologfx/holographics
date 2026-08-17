import Holographics from "../../control/lib/holographics-client"
import Vue from "vue"

export default {
	state: [],
	getters: {
		getWidgetById: state => id => {
			return state.find(widget => widget.id === id)
		},
		widgetName: (state, getters) => widget => {
			if (widget && widget.name) return widget.name
			if (getters.getWidgetModule(widget.type))
				return getters.getWidgetModule(widget.type).name
			return ""
		},
		isVisible: (state, getters) => (widget, options = {}) => {
			// Are we accounting for option parameters?
			const { showId, showName } = options

			// Simple cases first, if either of these is true, we should show
			if (showName !== undefined && showName === widget.name) return true
			if (showId !== undefined && showId === widget.id) return true

			// However, we might still need to show if one of the child entries matches
			if (
				showId !== undefined &&
				getters.visibleEntries(widget, showId).length > 0
			) {
				return true
			}

			// If we're targeted by a param, we've already returned by now.
			// If either of these are set, return false.
			if (showId !== undefined || showName !== undefined) return false

			// Now that we've gone past all the params, check for the visibility prop
			if (widget.props.visibility) return widget.props.visibility

			// If that wasn't present, perhaps one of the entries is visible
			if (getters.visibleEntries(widget, options).length > 0) return true

			// Nope, not meant to be
			return false
		},
		visibleEntries: (state, getters, rootState, rootGetters) => (
			widget,
			{ showId }
		) => {
			const entries = rootGetters.getEntriesByWidgetId(widget.id)
			if (showId === undefined) {
				return entries.filter(entry => entry.visibility === true)
			} else {
				return entries.filter(entry => entry.id === showId)
			}
		},
		getMergedStyle: (state, getters, rootState, rootGetters) => widget => {
			return Object.assign(
				{
					type: widget.type,
					widget_wrapping: true,
					...widget.props
				},
				rootState.style,
				rootGetters.getWidgetModule(widget.type).default.style || {},
				widget.style
			)
		},
		getWidgetLayoutPos: (state, getters) => (widget, { showId }) => {
			const mergedStyle = getters.getMergedStyle(widget)
			if (
				mergedStyle.vertical_position !== undefined &&
				mergedStyle.horizontal_position !== undefined
			) {
				return getters.getLayout(showId)[
					`${mergedStyle.vertical_position}${mergedStyle.horizontal_position}`
				]
			} else {
				return false
			}
		},
		getLayout: (state, getters) => showId => {
			const layout = {
				topleft: [],
				topcenter: [],
				topright: [],
				centerleft: [],
				centercenter: [],
				centerright: [],
				bottomleft: [],
				bottomcenter: [],
				bottomright: []
			}

			state.forEach(widget => {
				const mergedStyle = getters.getMergedStyle(widget)
				// // This is so hacky... but it works :)
				if (
					mergedStyle.vertical_position !== undefined &&
					mergedStyle.horizontal_position !== undefined
				) {
					if (getters.isVisible(widget, showId)) {
						layout[
							`${mergedStyle.vertical_position}${mergedStyle.horizontal_position}`
						].push(widget)
					}
				}
			})

			return layout
		}
	},
	actions: {
		createWidget({ commit }, widgetModule) {
			commit("commitStatus", true)
			Holographics.widgets
				.create({ data: { type: widgetModule.slug } })
				.then(() => {
					commit("commitStatus", false)
				})
		},
		runWidgetMethod({ commit }, { id, method, params }) {
			commit("commitStatus", true)
			this._vm.$socket.emit("runWidgetMethod", { id, method, params }, () => {
				commit("commitStatus", false)
			})
		},
		updateWidget({ commit }, { id, data }) {
			commit("commitStatus", true)
			Holographics.widgets.patch({ id, data }).then(() => {
				commit("commitStatus", false)
			})
		},
		setVisibility({ commit }, { id, visibility }) {
			commit("commitStatus", true)
			Holographics.widgets.toggle({ id, data: { visibility } }).then(() => {
				commit("commitStatus", false)
			})
		},
		removeWidget({ commit }, widget) {
			commit("commitStatus", true)
			return new Promise((resolve, reject) => {
				Holographics.widgets.remove({ id: widget.id }).then(() => {
					commit("commitStatus", false)
					resolve()
				})
			})
		},
		removeStyleKey({ getters, commit }, { id, key }) {
			const style = getters.getWidgetById(id).style
			style[key] = undefined
			Holographics.widgets.update({
				id,
				data: {
					style
				}
			})
		}
	}
}
