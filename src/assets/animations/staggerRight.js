export default {
	enter: (el, done, ease, duration) => {
		const tl = gsap.timeline({
			onComplete: done,
			defaults: {
				duration: duration / 2,
				ease
			}
		})

		const children = el.childNodes
		const tloffset = `-=${duration / 2}`

		tl.from(el, {
			x: "-=200"
		})

		tl.from(
			children,
			{
				delay: duration / 4,
				x: "-=50",
				opacity: 0,
				stagger: 0.2
			},
			tloffset
		)
	},
	leave: (el, done, ease, duration) => {
		const tl = gsap.timeline({
			onComplete: done,
			defaults: {
				duration: duration / 2,
				ease
			}
		})

		const children = el.childNodes
		const tloffset = `-=${duration / 2}`

		tl.to(
			children,
			{
				delay: duration / 4,
				x: "-=50",
				opacity: 0,
				stagger: 0.2
			},
			tloffset
		)

		tl.to(el, {
			x: "-=200"
		})
	}
}
