export default {
	enter: (el, done, ease, duration) => {
		gsap.from(el, {
			duration,
			rotationX: -90,
			transformOrigin: "bottom center",
			opacity: 0,
			ease,
			onComplete: done
		})
	},
	leave: (el, done, ease, duration) => {
		gsap.to(el, {
			duration,
			rotationX: -90,
			transformOrigin: "top center",
			opacity: 0,
			ease,
			onComplete: done
		})
	}
}
