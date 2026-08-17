<template lang="pug">
	el-select(
		v-model="selectValue")
		el-option(v-for="option in prop.options" :key="option.value" :label="option.name" :value="option.value") {{option.name}}
</template>

<script>
export default {
	props: ["prop", "value"],
	computed: {
		selectValue: {
			get() {
				return this.value
			},
			set(value) {
				this.$emit("input", value)
			}
		}
	}
}
</script>
