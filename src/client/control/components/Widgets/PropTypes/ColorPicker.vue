<template lang="pug">
	el-color-picker.mr-2(v-model="color" show-alpha)
</template>

<script>
export default {
	props: ["prop", "value"],
	computed: {
		color: {
			get() {
				return this.value
			},
			set(color) {
				this.$emit("input", color)
			}
		}
	}
}
</script>
