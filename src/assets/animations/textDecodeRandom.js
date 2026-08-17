export default {
	enter: (el, done, ease, duration) => {
		function shuffleArray(array) {
			for (var i = array.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1))
				var temp = array[i]
				array[i] = array[j]
				array[j] = temp
			}
			return array
		}

		const split = new SplitText(el.childNodes, {
			type: "chars"
		})

		const letters = shuffleArray(split.chars)

		gsap.from(el, {
			x: "-=200",
			duration,
			ease
		})

		const tl = gsap.timeline({
			onComplete: done,
			defaults: { duration: duration / 2 }
		})

		$(letters).each(function(index, element) {
			tl.from(
				letters[index],
				{
					scrambleText: "█",
					duration: 0.1
				},
				index * 0.05
			)
		})
	},
	leave: (el, done, ease, duration) => {
		gsap.to(el, duration, {
			opacity: 0,
			ease,
			onComplete: done
		})
	}
}
