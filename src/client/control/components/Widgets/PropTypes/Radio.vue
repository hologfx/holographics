<template lang="pug">
  div
    el-radio(v-for="option in prop.options" v-model="radio_value" :key="option.value" :label="option.value" border) {{option.name}}
</template>

<script>
export default {
	props: ["prop", "value"],
	computed: {
		radio_value: {
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
