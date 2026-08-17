<template lang="pug">
  div(
    v-bind:style="{ 'background-color': bgcolor, color: textcolor }"
    @click="$emit('insertColor', colorvariable)"
    ) {{colorvariable}}
</template>

<script>
import * as libcolor from "color"
import { mapState } from "vuex"

export default {
	name: "ColorPicker",
	props: ["colorvariable"],
	computed: {
		...mapState(["style"]),
		bgcolor: function() {
			return this.style[this.colorvariable.split("$")[1]]
		},
		textcolor: function() {
			if (this.bgcolor === "inherit") return "inherit"
			return libcolor(this.bgcolor).isLight() ? "black" : "white"
		}
	}
}
</script>
