/* eslint-disable no-eval */
import Eases from "../eases"

function enter(el, done) {
	const widgetModule = this.getWidgetModule(el.dataset.widgetmodule)
	if (widgetModule.selfAnimating) {
		setTimeout(done, this.style.enter_duration)
	} else if (this.options.still) {
		done()
	} else {
		eval(
			this.animations.find(
				animation => animation.filename === this.style.enter_animation
			).contents
		).enter(
			el,
			done,
			Eases[this.style.enter_ease].enter,
			this.style.enter_duration / 1000
		)
	}
}

function leave(el, done) {
	const widgetModule = this.getWidgetModule(el.dataset.widgetmodule)
	if (widgetModule.selfAnimating) {
		setTimeout(done, this.style.leave_duration)
	} else if (this.options.still) {
		done()
	} else {
		eval(
			this.animations.find(
				animation => animation.filename === this.style.leave_animation
			).contents
		).leave(
			el,
			done,
			Eases[this.style.leave_ease].leave,
			this.style.leave_duration / 1000
		)
	}
}

export { enter, leave }
