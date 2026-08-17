<template lang="pug">
.card(@mouseover="hover = true" @mouseout="hover = false")
  .card-header(:style="style")
    span.mt-1 {{ title }}
    small  - ({{theme_variable}})
  .card-body
    p.card-text
      slot
  .card-footer(v-if="colortools")
    .d-flex
      button.mr-2.flex-fill.btn.btn-secondary.btn-sm.far(@click="toggleTransparency", :class="transparentize_button_class")
      button.mr-2.flex-fill.btn.btn-sm.fas.fa-fill(@click="setColor('rgb(0,0,0)')", style="background: black;")
      button.mr-2.flex-fill.btn.btn-sm.fas.fa-fill(@click="setColor('rgb(120,120,120)')", style="background: rgb(120,120,120)")
      button.flex-fill.btn.btn-sm.fas.fa-fill(@click="setColor('rgb(255,255,255)')", style="background: white; color: black")
    .d-flex.mt-3(v-if="palette && palette.length > 0")
      el-button.flex-fill(:style="{ background: palette[0] }" size="small" @click="colorPreset(0)") 1
      el-button.flex-fill(:style="{ background: palette[1] }" size="small" @click="colorPreset(1)") 2
      el-button.flex-fill(:style="{ background: palette[2] }" size="small" @click="colorPreset(2)") 3
      el-button.flex-fill(:style="{ background: palette[3] }" size="small" @click="colorPreset(3)") 4
      el-button.flex-fill(:style="{ background: palette[4] }" size="small" @click="colorPreset(4)") 5
  .card-footer.d-flex
    el-color-picker.mr-2(v-model="color" show-alpha)
    
</template>

<script>
import * as libcolor from "color"

export default {
	props: ["title", "name", "module", "colortools"],
	data: function() {
		return {
			oldAlpha: false,
			transparentized: false
		}
	},
	methods: {
		colorPreset(number) {
			this.color = this.palette[number]
		},
		setColor(color) {
			this.color = color
		},
		toggleTransparency() {
			const color = libcolor(this.color)
			if (this.oldAlpha === false) {
				this.oldAlpha = color.alpha()
				this.color = color.alpha(0).toString()
			} else if (this.oldAlpha > 0) {
				this.color = color.alpha(this.oldAlpha).toString()
				this.oldAlpha = false
			} else {
				this.color = color.alpha(1).toString()
			}
		}
	},
	computed: {
		transparentize_button_class() {
			if (this.oldAlpha === false) return "fa-eye"
			return "fa-eye-slash"
		},
		palette() {
			return this.$store.state.activePalette
		},
		theme_variable() {
			return "$" + this.name
		},
		color: {
			get() {
				const color = this.$store.state[this.module][this.name]
				return color
			},
			set(color) {
				this.$store.dispatch("updateState", {
					[this.module]: {
						[this.name]: color == null ? "rgba(0,0,0,0)" : color
					}
				})
			}
		},
		style() {
			return {
				background: this.color,
				color: libcolor(this.color).isLight() ? "black" : "white"
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.d-flex > button.flex-fill {
	color: white;
	font-weight: bold;
	text-align: center;
}
</style>
