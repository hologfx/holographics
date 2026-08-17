<template lang="pug">
#settings.mt-3
	.container-fluid
		.row
			.col-lg-9
				h2 Animations
				h4 Preview
				p
					small Not all animations can be previewed here, you may need to check the render view.
				div.exampleContainer
					div.exampleWidget(ref="exampleWidget" id="exampleWidget" :mergedStyle="mergedStyle")
						h2 Widget title very long
						span Shorter text
				div.mb-3
					h4 <i class="fas fa-sign-in-alt"></i> Enter animation
					el-select(v-model="enter_animation").mr-1
						el-option(v-for="animation in animations" :key="animation.filename" :label="animation.filename" :value="animation.filename")
					el-select(v-model="enter_ease").mr-1.mb-2
						el-option(v-for="ease in easings" :key="ease" :label="ease" :value="ease")
					
					p Duration (ms)
					el-slider(v-model="enter_duration" show-input :min="0" :max="2000" :step="100")
					
				div.mb-3
					h4 <i class="fas fa-sign-out-alt"></i> Leave animation
					el-select(v-model="leave_animation").mr-1
						el-option(v-for="animation in animations" :key="animation.filename" :label="animation.filename" :value="animation.filename")
					el-select(v-model="leave_ease").mr-1.mb-2
						el-option(v-for="ease in easings" :key="ease" :label="ease" :value="ease")
					
					p Duration (ms)
					el-slider(v-model="leave_duration" show-input :min="0" :max="2000" :step="100")
				div.mb-3
					h4 <i class="fas fa-arrows-alt"></i> Reposition easing
					el-select(v-model="reposition_ease").mr-1
						el-option(v-for="ease in easings" :key="ease" :label="ease" :value="ease")
					
					p Duration (ms)
					el-slider(v-model="reposition_duration" show-input :min="0" :max="2000" :step="100")
			.col-lg-3
				.alert.alert-info.mb-3
					p.mb-3 Animations are how widgets enter and leave the screen, and change positions. They are simple JavaScript files. You can open the source files to see how they work and customize them to your needs. Changes refresh instantly.
					button.btn.btn-secondary.mb-3.mr-2(@click.prevent="$socket.emit('open-dir', './animations')" v-if="debug.appMode.environment == 'electron'") Open animations directory
					p.mb-3 Sometimes after an update, not all default animations can be safely overwritten. If this happens, use this button to reset all animations back to defaults.
					el-popover.mb-3.mr-2(
						placement="top"
						width="300"
						trigger="hover")
						p Resetting your animations will discard any changes you may have made to default animations.
						ConfirmButton.btn.btn-danger(@perform="reset_animations" slot="reference") Reset default animations
</template>

<script>
import { mapState, mapActions } from "vuex"
import Eases from "../../render/lib/eases"
import ConfirmButton from "@/components/general/ConfirmButton"

export default {
	components: {
		ConfirmButton
	},
	data() {
		return {
			initializing: true,
			easings: [
				"Linear",
				"Sine",
				"Quad",
				"Cubic",
				"Quart",
				"Quint",
				"Expo",
				"Circ",
				"SlowMo",
				"Rough",
				"Stepped",
				"Bounce",
				"Elastic",
				"Back"
			],
			mergedStyle: {
				type: "Clock",
				timeformat: "12H",
				visibility: true,
				widget_wrapping: true,
				horizontal_position: "left",
				vertical_position: "top",
				activeTheme: "default.styl",
				primary_color: "rgb(69, 151, 251)",
				secondary_color: "rgb(69, 151, 251)",
				background_a: "rgb(38, 38, 38)",
				background_b: "rgb(79, 79, 79)",
				text_a: "rgb(219, 219, 219)",
				text_b: "rgb(0, 0, 0)",
				global_padding: "8",
				widget_padding: "2",
				widget_offset: "2",
				font_size: "3",
				canvas_bg: "rgba(255, 255, 255, 0)",
				enter_animation: "xSlideToEdge.js",
				enter_ease: "Expo",
				enter_duration: 600,
				leave_animation: "xSlideToEdge.js",
				leave_ease: "Expo",
				leave_duration: 600,
				reposition_ease: "Back",
				reposition_duration: 1000
			}
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.initializing = false

			// Start preview loop
			this.loop()
		})
	},
	computed: {
		...mapState(["animations", "style", "debug"]),
		enter_animation: {
			get() {
				return this.$store.state.style.enter_animation
			},
			set(enter_animation) {
				this.$store.dispatch("updateStyle", { enter_animation })
			}
		},
		enter_ease: {
			get() {
				return this.$store.state.style.enter_ease
			},
			set(enter_ease) {
				this.$store.dispatch("updateStyle", { enter_ease })
			}
		},
		enter_duration: {
			get() {
				return Number(this.$store.state.style.enter_duration)
			},
			set(enter_duration) {
				if (!this.initializing)
					this.$store.dispatch("updateStyle", { enter_duration })
			}
		},
		leave_animation: {
			get() {
				return this.$store.state.style.leave_animation
			},
			set(leave_animation) {
				this.$store.dispatch("updateStyle", { leave_animation })
			}
		},
		leave_ease: {
			get() {
				return this.$store.state.style.leave_ease
			},
			set(leave_ease) {
				this.$store.dispatch("updateStyle", { leave_ease })
			}
		},
		leave_duration: {
			get() {
				return Number(this.$store.state.style.leave_duration)
			},
			set(leave_duration) {
				if (!this.initializing)
					this.$store.dispatch("updateStyle", { leave_duration })
			}
		},
		// update_enter_animation: {
		//   get() { return this.$store.state.style.update_enter_animation },
		//   set(update_enter_animation) { this.$store.dispatch('updateStyle', { update_enter_animation }) }
		// },
		// update_enter_ease: {
		//   get() { return this.$store.state.style.update_enter_ease },
		//   set(update_enter_ease) { this.$store.dispatch('updateStyle', { update_enter_ease }) }
		// },
		// update_enter_duration: {
		//   get() { return Number(this.$store.state.style.update_enter_duration) },
		//   set(update_enter_duration) { if (!this.initializing) this.$store.dispatch('updateStyle', { update_enter_duration }) }
		// },
		// update_leave_animation: {
		//   get() { return this.$store.state.style.update_leave_animation },
		//   set(update_leave_animation) { this.$store.dispatch('updateStyle', { update_leave_animation }) }
		// },
		// update_leave_ease: {
		//   get() { return this.$store.state.style.update_leave_ease },
		//   set(update_leave_ease) { this.$store.dispatch('updateStyle', { update_leave_ease }) }
		// },
		// update_leave_duration: {
		//   get() { return Number(this.$store.state.style.update_leave_duration) },
		//   set(update_leave_duration) { if (!this.initializing) this.$store.dispatch('updateStyle', { update_leave_duration }) }
		// },
		reposition_ease: {
			get() {
				return this.$store.state.style.reposition_ease
			},
			set(reposition_ease) {
				this.$store.dispatch("updateStyle", { reposition_ease })
			}
		},
		reposition_duration: {
			get() {
				return Number(this.$store.state.style.reposition_duration)
			},
			set(reposition_duration) {
				if (!this.initializing)
					this.$store.dispatch("updateStyle", { reposition_duration })
			}
		}
	},
	methods: {
		...mapActions(["reset_animations"]),
		loop() {
			this.enter()
			setTimeout(() => {
				this.leave()
			}, Number(this.style.enter_duration) + 500)
		},
		enter() {
			const el = this.$refs.exampleWidget
			try {
				eval(
					this.animations.find(
						animation => animation.filename === this.style.enter_animation
					).contents
				).enter(
					el,
					() => {},
					Eases[this.style.enter_ease].enter,
					this.enter_duration / 1000
				)
			} catch (error) {
				console.log(error)
			}
		},
		leave() {
			const el = this.$refs.exampleWidget
			const done = () => {
				setTimeout(() => {
					this.clear()
					this.loop()
				}, 500)
			}
			// eslint-disable-next-line no-eval
			try {
				eval(
					this.animations.find(
						animation => animation.filename === this.style.leave_animation
					).contents
				).leave(
					el,
					done,
					Eases[this.style.leave_ease].leave,
					this.leave_duration / 1000
				)
			} catch (error) {
				console.log(error)
			}
		},
		clear() {
			try {
				gsap.set(this.$refs.exampleWidget, {
					clearProps: "all"
				})
			} catch (error) {
				console.log(error)
			}
		}
	}
}
</script>

<style lang="scss">
@import "~bootstrap/scss/functions";
@import "../assets/scss/_bootstrap_variables";

.exampleContainer {
	width: 100%;
	height: 20vh;
	overflow: hidden;
	background: #ccc;
	border-radius: 5px;
	box-shadow: inset 0px 0px 4px 0px rgba(0, 0, 0, 0.4);
	padding: 2vh;
	font-size: 1em;
}
.exampleWidget {
	background: white;
	border: 2px solid rgba(0, 0, 0, 0.5);
	display: inline-block;
	padding: 2vh;
	min-height: 0;
	min-width: 0;
	box-sizing: border-box;
	h2 {
		font-size: 1.5em;
	}
	h2,
	span,
	o {
		background: $blue;
		color: transparent;
	}
}
</style>
