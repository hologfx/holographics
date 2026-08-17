export default {
	enter: (el, done, ease, duration) => {
		gsap.from(el, {
			duration,
			opacity: 0,
			ease,
			onComplete: done
		})
	},
	leave: (el, done, ease, duration) => {
		gsap.to(el, {
			duration,
			opacity: 0,
			ease,
			onComplete: done
		})
	}
}
