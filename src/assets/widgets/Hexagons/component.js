// Receives the widget, widgetModule and entries as props.
export default {
	beforeDestroy() {
		const polygons = document.querySelectorAll("#hexs polygon")
		gsap.to(polygons, 1, {
			scale: 0
		})
	},
	mounted() {
		const polygons = document.querySelectorAll("#hexs polygon")
		const center = 85
		const polygonCenter = polygons[center]
		polygonCenter.classList.add("center")
		gsap.from(polygons, {
			duration: 10,
			scale: 0,
			ease: "expo"
		})
		// GSAP Timeline
		const tl = gsap.timeline({
			delay: this.widget.props.animation_delay,
			repeat: -1,
			defaults: {
				duration: this.widget.props.animation_duration,
				ease: "sine",
				stagger: {
					amount: this.widget.props.stagger,
					from: this.widget.props.stagger_from,
					grid: [10, 19]
				}
			}
		})

		tl.delay = 1

		let overlap
		if (this.widget.props.animation_overlap > 0) {
			overlap = `+=${Math.abs(this.widget.props.animation_overlap)}`
		} else {
			overlap = `-=${Math.abs(this.widget.props.animation_overlap)}`
		}

		tl.set(polygons, {
			transformOrigin: "50% 50%"
		})
		function tween(object) {
			tl.to(polygons, object, overlap)
		}
		tween({
			scale: 1.04
		})
		tween({
			rotation: 30,
			x: 20,
			y: -10,
			scaleX: 0.9,
			scaleY: 0.9,
			ease: "back.out(1.7)"
		})
		tween({
			scaleX: 0.1,
			scaleY: 2,
			ease: "power4.inOut"
		})
		tween({
			scale: 0.9,
			stagger: { amount: 0.5, from: "start", grid: [10, 19] }
		})
		tween({
			ease: "back.out(1.7)",
			rotate: 0
		})
		tween({
			rotation: gsap.utils.wrap([-30, 30])
		})
		tween({
			x: gsap.utils.wrap([50, 0]),
			scale: gsap.utils.wrap([0, 1.2]),
			ease: "elastic.out(1, 0.3)"
		})
		tween({
			scale: 1.1,
			x: 0,
			ease: "elastic.out(1, 0.3)",
			stagger: { amount: 0.5, from: "end" }
		})
		tween({
			rotation: 0,
			x: 0,
			y: 0,
			scale: 1,
			ease: "back.out(1.7)"
		})
	}
}
