<template lang="pug">
#render(v-if="readyToRender")
	transition(v-for="(widget, index) in widgets" :duration="getAnimationDurations(widget)")
		component(
		:key="widget.id"
		:is="widgetModuleComponents[widget.type]"
		:id="widget.id"
		v-if="isVisible(widget, options)"
		:widget="widget"
		:ref="widget.id"
		:index="index"
		:class="[ getMergedStyle(widget).widget_wrapping ? 'widget' : '', widgetName(widget).split(' ').join('').toLowerCase(), getWidgetModule(widget.type).slug , 'notAnimating']"
		:data-widgetModule=`getWidgetModule(widget.type).slug`
		:entries=`getEntriesByWidgetId(widget.id)`
		:visibleEntries=`visibleEntries(widget, options)`
		:visibleEntry=`visibleEntries(widget, options)[0]`
		:widgetModule=`getWidgetModule(widget.type)`
		:mergedStyle=`getMergedStyle(widget)`
		:widgetLayoutPos=`getWidgetLayoutPos(widget, options)`
		:animations="animations"
		:options="options"
		)
</template>

<script>
/* eslint-disable no-eval */
import { mapState, mapGetters } from "vuex"
import Vue from "vue"

import mountComponent from "./lib/widget/component"
import { getSize, getPosition } from "./lib/widget/physics"
import { enter, leave } from "./lib/widget/animations"
import Eases from "./lib/eases"

export default {
	data() {
		return {
			widgetModuleComponents: {},
			options: {},
			initializing: true
		}
	},
	computed: {
		...mapState([
			"widgets",
			"style",
			"widgetModules",
			"entries",
			"themes",
			"animations"
		]),
		...mapGetters([
			"widgetName",
			"getWidgetModule",
			"getEntriesByWidgetId",
			"getEntryById",
			"getMergedStyle",
			"getWidgetLayoutPos",
			"getActiveThemeCSS",
			"getThemeByFilename",
			"getWidgetCSS",
			"visibleEntries",
			"isVisible",
			"readyToRender"
		])
	},
	beforeCreate() {
		this.$store.dispatch("getInitialState")
		console.log("Renderer bootup")
	},
	mounted() {
		Vue.set(this, "options", {
			// Still disables all animations
			still: this.$route.query.still === "true",
			// ShowID finds the id of the corresponding widget or entry and shows only that item
			showId: this.$route.query.showId,
			// ShowName finds the name of the corresponding widgets shows only those widgets
			showName: this.$route.query.showName,
			// Theme overrides the theme applied to the renderer
			theme: this.$route.query.theme
		})
		setTimeout(() => {
			this.initializing = false
		}, 2000)

		window.addEventListener("resize", this.styleWidgets)
	},
	updated() {
		this.styleWidgets()
	},
	methods: {
		mountComponent,
		positionWidgets() {
			if (!this.widgets) return
			for (const [index, widget] of this.widgets.entries()) {
				// Only position widget if it is visible
				const element = document.getElementById(widget.id)
				if (!element) {
					continue
				}
				const widgetModule = this.getWidgetModule(widget.type)
				if (widgetModule.selfPositioning) return
				const mergedStyle = this.getMergedStyle(widget)
				const widgetLayoutPos = this.getWidgetLayoutPos(widget, this.options)
				const position = getPosition(
					mergedStyle,
					widget,
					index,
					widgetLayoutPos
				)
				gsap.set(`#${widget.id}`, position)
			}
		},
		sizeWidgets() {
			if (!this.widgets) return
			for (const widget of this.widgets) {
				// Only position widget if it is visible
				const element = document.getElementById(widget.id)
				if (!element) {
					continue
				}
				const widgetModule = this.getWidgetModule(widget.type)
				if (widgetModule.selfSizing) return
				const size = getSize(this.getMergedStyle(widget))
				gsap.set(`#${widget.id}`, size)
			}
		},
		styleWidgets(skipAnimation) {
			if (this.options.still || skipAnimation || this.initializing) {
				this.sizeWidgets()
				this.positionWidgets()
			} else {
				const state = Flip.getState([".notAnimating"], {
					props: "fontSize, padding"
				})
				this.sizeWidgets()
				this.positionWidgets()
				this.flipping = Flip.from(state, {
					duration: this.style.reposition_duration / 1000,
					ease: Eases[this.style.reposition_ease].reposition,
					nested: true,
					absolute: true
				})
			}
		},
		getAnimationDurations(widget) {
			const mergedStyle = this.getMergedStyle(widget)
			return {
				enter: mergedStyle.enter_duration,
				leave: mergedStyle.leave_duration
			}
		},
		setActiveTheme(theme) {
			document.getElementById(
				"theme_style"
			).innerHTML = this.getThemeByFilename(theme).rendered
		},
		enter,
		leave
	},
	watch: {
		style(newStyle, oldStyle) {
			gsap.to(document.body, {
				duration: this.options.still ? 0 : 1,
				backgroundColor: newStyle.canvas_bg
			})

			this.styleWidgets()

			if (this.readyToRender)
				this.setActiveTheme(this.options.theme || newStyle.activeTheme)
		},
		getActiveThemeCSS(css) {
			if (this.readyToRender)
				document.getElementById("theme_style").innerHTML = css
		},
		readyToRender(isReady) {
			if (isReady) {
				this.setActiveTheme(this.options.theme || this.style.activeTheme)
			}
		},
		widgetModules(widgetModules) {
			// Setup widget components when receiving widget modules
			widgetModules.forEach(widgetModule => {
				if (Object.entries(widgetModule.vue_component).length > 0) {
					console.log("Now importing component")
					// Until all of our render applications (V-Mix, CasparCG, OBS etc) have full support for
					// dynamic importing, we're back to eval for the moment
					this.mountComponent(eval(widgetModule.vue_component), widgetModule)
				} else {
					this.mountComponent({}, widgetModule)
				}

				if (Object.entries(widgetModule.vue_component).length > 0) {
					eval(widgetModule.include)
				}
			})

			this.received_widgetModules = true
			document.getElementById("widgets_style").innerHTML = this.getWidgetCSS
		}
	}
}
</script>
