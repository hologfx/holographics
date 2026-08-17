// Receives the widget, widgetModule and entries as props.

// For every particle field we create, we have to generate a unique ID
// CSS has trouble with numbers in IDs so this has to be a custom function
function makeid() {
	var text = ""
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

	// Return 5 random characters from the above string
	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length))

	return text
}

export default {
	data() {
		return {
			id: ""
		}
	},
	updated() {
		// TODO:
		// Work with window.pJSDom[0].pJS.fn.particlesRefresh() to update when we
		// receive new settings. Problem is we have no way of identifying for changed
		// variables on a per-widget basis.
	},
	mounted() {
		if (window.particlesJS !== undefined) {
			// Create a new div element
			const particles = document.createElement("div")
			// Set the ID of the new element to a generated ID
			particles.id = makeid()
			this.id = particles.id
			// Give the new element a CSS class so we can target it
			particles.className = "particle-js-container"
			// Append the new element to the root widget element ($el)
			this.$el.appendChild(particles)
			// Startup particlesJS, targeting the element ID we created earlier
			particlesJS(particles.id, {
				particles: {
					number: {
						value: Number(this.mergedStyle.particle_count),
						density: {
							enable: false,
							value_area: 6000
						}
					},
					color: {
						value: Color(
							this.mergedStyle[this.mergedStyle.particle_color]
						).hex()
					},
					opacity: {
						value: Color(
							this.mergedStyle[this.mergedStyle.particle_color]
						).alpha(),
						random: this.mergedStyle.particle_animate_opacity,
						anim: {
							enable: this.mergedStyle.particle_animate_opacity,
							speed: this.mergedStyle.particle_animate_opacity_speed,
							opacity_min: 0.1,
							sync: false
						}
					},
					size: {
						value: Number(this.mergedStyle.particle_size),
						random: this.mergedStyle.particle_size_random,
						anim: {
							enable: this.mergedStyle.particle_animate_size,
							speed: this.mergedStyle.particle_animate_size_speed,
							size_min: 0,
							sync: false
						}
					},
					line_linked: {
						enable: this.mergedStyle.form_lines,
						distance: Number(this.mergedStyle.line_distance),
						color: Color(this.mergedStyle[this.mergedStyle.line_color]).hex(),
						opacity: Color(
							this.mergedStyle[this.mergedStyle.line_color]
						).alpha(),
						width: Number(this.mergedStyle.line_width)
					},
					move: {
						enable: this.mergedStyle.movement_enable,
						speed: Number(this.mergedStyle.movement_speed),
						direction: this.mergedStyle.movement_direction,
						random: this.mergedStyle.movement_random,
						straight: this.mergedStyle.movement_straight,
						out_mode: this.mergedStyle.movement_bounce,
						attract: { enable: true, rotateX: 600, rotateY: 1200 }
					}
				},
				retina_detect: this.mergedStyle.retina_enable
			})
		}
	},
	destroyed() {
		// There is one problem with ParticleJS, it persists the calculations even
		// when the canvas is removed from the DOM.
		// To work around this we will splice pJSDom (the array containing all ParticleJS)
		// instances, until there are no more. At that point we destroy ParticleJS from
		// the window. We do recreate the pJSDom array so we can restart it later.
		const pJS_index = window.pJSDom.findIndex(item => {
			return item.pJS.canvas.el.offsetParent.id === this.id
		})

		const pJS = window.pJSDom[pJS_index].pJS

		setTimeout(() => {
			if (window.pJSDom.length === 1) {
				pJS.fn.vendors.destroypJS()
				window.pJSDom = []
			} else {
				window.pJSDom.splice(pJS_index, 1)
			}
			// Note to self: set this timeout to the transition time when we implement it
		}, 1500)
	}
}
