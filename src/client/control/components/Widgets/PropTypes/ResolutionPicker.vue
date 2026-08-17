<template lang="pug">
	div
		el-select.mb-3(
			:value="value"
			@change="selectionChange($event)")
			el-option(v-for="option in resolutions" :key="option" :value="option") {{option}}
		label.form-control-label(style="display:block" v-if="selectingCustom") Width
		input.form-control.mb-3(
			type="number"
			v-model="customWidth"
			@blur="customChange()"
			v-if="selectingCustom"
			name="width")
		label.form-control-label(style="display:block" v-if="selectingCustom") Height
		input.form-control.mb-3(
			type="number"
			v-model="customHeight"
			@blur="customChange()"
			v-if="selectingCustom"
			name="height")
</template>

<script>
export default {
	props: ["prop", "value"],
	data() {
		return {
			selectingCustom: false,
			customWidth: 1920,
			customHeight: 1080,
			resolutions: [
				"3840x2160",
				"2560x1440",
				"1920x1200",
				"1920x1080",
				"1680x1050",
				"1440x900",
				"1280x720",
				"800x600",
				"720x576",
				"720x480",
				"640x360",
				"Custom"
			]
		}
	},
	mounted() {
		this.selectingCustom = !this.resolutions.some(res => res === this.value)
		this.customWidth = this.value.split("x")[0]
		this.customHeight = this.value.split("x")[1]
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
			this.$emit("input", `${this.customWidth}x${this.customHeight}`)
		}
	}
}
</script>
