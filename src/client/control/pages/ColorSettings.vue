<template lang="pug">
#settings.mt-3
  .container-fluid
    .row
      .col-lg-8
        h2 Colors
        p.lead The settings chosen here are used by themes to determine their look and feel.
        h3 Main colors
        .card-deck.mb-3
          ColorPickerCard(title="Primary Color", name="primary_color", module="style", :colortools="colortools")
            | Main color, usually themes derive their general look and feel from this color.
          ColorPickerCard(title="Secondary Color", name="secondary_color", module="style", :colortools="colortools")
            | Second main theme color.
        h3 Background
        .card-deck.mb-3
          ColorPickerCard(title="Background A", name="background_a", module="style", :colortools="colortools")
            | Used as background for widgets.
          ColorPickerCard(title="Background B", name="background_b", module="style", :colortools="colortools")
            | Second background color, sometimes used for gradients.
        h3 Text colors
        .card-deck.mb-3
          ColorPickerCard(title="Text A", name="text_a", module="style", :colortools="colortools")
            | Text color for titles or important information
          ColorPickerCard(title="Text B", name="text_b", module="style", :colortools="colortools")
            | Text color for body or paragraph text
        h3 Render page
        .card-deck.mb-3
          ColorPickerCard(title="Render Background", name="canvas_bg", module="style", :colortools="colortools")
            | Sets the background for the render canvas.
      .col-lg-4
        .mb-2 Color tools:
        .mb-3
          el-switch(v-model="colortools")
        Palettes

</template>

<script>
import Palettes from "@/components/ColorSettings/Palettes"
import ColorPickerCard from "@/components/ColorSettings/ColorPickerCard"

export default {
	components: {
		ColorPickerCard,
		Palettes
	},
	data() {
		return {
			colortools: false
		}
	},
	computed: {
		colors() {
			return [
				this.$store.state.style.primary_color,
				this.$store.state.style.secondary_color,
				this.$store.state.style.background_a,
				this.$store.state.style.background_b,
				this.$store.state.style.text_a,
				this.$store.state.style.text_b,
				this.$store.state.style.canvas_bg
			]
		},
		global_padding: {
			get() {
				return this.$store.state.style.global_padding
			},
			set(global_padding) {
				this.$store.dispatch("updateState", { style: { global_padding } })
			}
		},
		widget_padding: {
			get() {
				return this.$store.state.style.widget_padding
			},
			set(widget_padding) {
				this.$store.dispatch("updateState", { style: { widget_padding } })
			}
		},
		font_size: {
			get() {
				return this.$store.state.style.font_size
			},
			set(font_size) {
				this.$store.dispatch("updateState", { style: { font_size } })
			}
		},
		canvas_bg: {
			get() {
				return this.$store.state.style.canvas_bg
			},
			set(canvas_bg) {
				this.$store.dispatch("updateState", { style: { canvas_bg } })
			}
		}
	}
}
</script>

<style lang="scss">
</style>
