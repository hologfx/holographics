export default {
	enter: (el, done, ease, duration) => {
		// const children = el.childNodes

		console.log(el)

		const split = new SplitText(el, {
			type: "chars"
		})
		console.log(split)

		gsap.from(el, {
			x: "-=200",
			duration,
			overflow: "hidden",
			ease
		})

		gsap.from(split.chars, {
			duration,
			opacity: 0,
			y: "-=150",
			stagger: 0.01,
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
