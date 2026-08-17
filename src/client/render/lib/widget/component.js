import Icon from "../../components/Icon"
import { mapGetters } from "vuex"

import { getSize, getPosition } from "./physics"
import Eases from "../eases"

function mountComponent(component, widgetModule) {
	component = component || {}
	component.components = { Icon }
	component.name = widgetModule.slug
	component.template = widgetModule.vue_template
	component.props = [
		"widget",
		"entries",
		"widgetModule",
		"visibleEntry",
		"visibleEntries",
		"mergedStyle",
		"index",
		"widgetLayoutPos",
		"animations",
		"options"
	]
	component.watch = component.watch || {}

	component.computed = component.computed || {}
	Object.assign(component.computed, {
		...mapGetters(["isVisibleEntry"])
	})

	component.methods = component.methods || {}
	component.methods.applyStyle = function() {
		gsap.set(this.$el, {
			zIndex: -(this.index * 100) || 0,
			z: -(this.index * 100)
		})

		if (!widgetModule.selfPositioning) {
			gsap.set(
				this.$el,
				getPosition(
					this.mergedStyle,
					this.widget,
					this.index,
					this.widgetLayoutPos,
					this.$parent.$children
				)
			)
		}

		if (!widgetModule.selfSizing) {
			gsap.set(this.$el, getSize(this.mergedStyle))
		}
	}
	component.methods.animate = function(direction) {
		if (this.widgetModule.selfAnimating) return
		if (this.options.still) return
		const animation = this.animations.find(animation => {
			return animation.filename === this.mergedStyle[`${direction}_animation`]
		}).contents

		this.$el.classList.remove("notAnimating")
		// eslint-disable-next-line no-eval
		eval(animation)[direction](
			this.$el,
			() => {
				this.$el.classList.add("notAnimating")
			},
			Eases[this.mergedStyle[`${direction}_ease`]][direction],
			this.mergedStyle[`${direction}_duration`] / 1000
		)
	}

	const originalMounted = component.mounted || function() {}
	const originalBeforeDestroy = component.beforeDestroy || function() {}

	component.mounted = function() {
		this.applyStyle()
		this.animate("enter")
		this.$nextTick(() => {
			originalMounted.apply(this, arguments)
		})
	}

	component.beforeDestroy = function() {
		this.animate("leave")
		this.$nextTick(() => {
			originalBeforeDestroy.apply(this, arguments)
		})
	}

	this.widgetModuleComponents[widgetModule.slug] = component
}

export default mountComponent
