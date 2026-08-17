// Receives the widget, widgetModule and entries as props.
export default {
	data() {
		return {
			animation: {},
			clones: [],
			windowWidth: 0,
			windowHeight: 0,
			required_clone_amount: 0,
			tickerWidth: 0,
			tickerHeight: 0,
			templateWidth: 0
		}
	},
	watch: {
		visibleEntries: {
			immediate: true,
			handler(newEntries, oldEntries) {
				this.setup_clones()
			}
		},
		mergedStyle() {
			this.update_params()
		},
		tickerWidth() {
			this.setup_clones()
			this.setup_animation()
		},
		templateWidth() {
			this.setup_clones()
			this.setup_animation()
		},
		speed() {
			this.setup_animation()
		}
	},
	computed: {
		animationDuration() {
			const PX_PER_SECOND = this.speed || 100
			const duration = this.templateWidth / PX_PER_SECOND
			return duration
		},
		speed() {
			return this.widget.props.speed || 100
		}
	},
	methods: {
		setup_animation() {
			if (this.templateWidth > 0) {
				this.animation = gsap.fromTo(
					this.$refs.clones,
					{ x: 0 },
					{
						x: -this.templateWidth,
						ease: Eases.Linear.enter,
						duration: this.animationDuration,
						repeat: -1
					}
				)
			}
		},
		setup_clones() {
			this.required_clone_amount =
				Math.ceil(this.tickerWidth / this.templateWidth) + 1

			this.clones = []
			for (let i = 0; i < this.required_clone_amount; i++) {
				this.clones.push(...this.visibleEntries)
			}
		},
		update_params() {
			try {
				this.tickerWidth = this.$refs.ticker.clientWidth
				this.tickerHeight = this.$refs.ticker.clientHeight
				this.templateWidth = this.$refs.template.clientWidth
				this.windowWidth = window.innerWidth
				this.windowHeight = window.innerHeight
			} catch (e) {}
		}
	},
	updated() {
		this.update_params()
	},
	mounted() {
		window.addEventListener("resize", this.update_params)
		this.$refs.ticker.addEventListener("transitionend", this.update_params)
		setTimeout(() => {
			this.update_params()
			this.setup_clones()
			this.setup_animation()
		}, 100)
	}
}
