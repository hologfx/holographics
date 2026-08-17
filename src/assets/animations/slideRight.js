export default {
	enter: (el, done, ease, duration) => {
		gsap.from(el, duration, {
			xPercent: -200,
			opacity: 0,
			ease,
			onComplete: done
		})
	},
	leave: (el, done, ease, duration) => {
		gsap.to(el, duration, {
			xPercent: 200,
			opacity: 0,
			ease,
			onComplete: done
		})
	}
}
