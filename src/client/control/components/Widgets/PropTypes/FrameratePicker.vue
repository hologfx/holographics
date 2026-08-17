<template lang="pug">
	div
		el-select.mb-3(
			:value="value"
			@change="selectionChange($event)")
			el-option(v-for="option in framerates" :key="option" :value="option") {{option}}
		label.form-control-label(style="display:block" v-if="selectingCustom") Framerate
		input.form-control.mb-3(
			type="number"
			v-model="customFramerate"
			@blur="customChange()"
			v-if="selectingCustom"
			name="width")
</template>

<script>
export default {
	props: ["prop", "value"],
	data() {
		return {
			selectingCustom: false,
			customFramerate: 30,
			framerates: [23.976, 24, 25, 29.97, 30, 50, 59.94, 60, "Custom"]
		}
	},
	mounted() {
		this.selectingCustom = !this.framerates.some(res => res === this.value)
		this.customFramerate = this.value
	},
	methods: {
		selectionChange(value) {
			if (value === "Custom") {
				this.selectingCustom = true
			} else {
				this.selectingCustom = false
				this.$emit("input", value)
			}
		},
		customChange(value) {
			this.$emit("input", this.customFramerate)
		}
	}
}
</script>
