export default {
	enter: (el, done, ease, duration) => {
		const children = el.childNodes

		gsap.from(el, {
			x: "-=200",
			duration,
			ease
		})

		gsap.to(children, {
			duration,
			scrambleText: {
				revealDelay: duration / 2,
				chars: "-"
			},
			ease: "none",
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
