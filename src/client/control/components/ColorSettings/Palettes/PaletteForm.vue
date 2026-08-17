<template lang="pug">
.createpalette
  el-form(@submit="finished")
  .mb-2
    el-input(v-model="name" placeholder="Name this palette")
  .mb-2.d-flex
    el-color-picker.mr-1(v-model="colors[0]" show-alpha)
    el-input(v-model="colors[0]" placeholder="Color 1")
  .mb-2.d-flex
    el-color-picker.mr-1(v-model="colors[1]" show-alpha)
    el-input(v-model="colors[1]" placeholder="Color 2")
  .mb-2.d-flex
    el-color-picker.mr-1(v-model="colors[2]" show-alpha)
    el-input(v-model="colors[2]" placeholder="Color 3")
  .mb-2.d-flex
    el-color-picker.mr-1(v-model="colors[3]" show-alpha)
    el-input(v-model="colors[3]" placeholder="Color 4")
  .mb-2.d-flex
    el-color-picker.mr-1(v-model="colors[4]" show-alpha)
    el-input(v-model="colors[4]" placeholder="Color 5")
  el-button(type="success" @click="finished")
    slot
  el-button(type="secondary" @click="$emit('closeForm')") Cancel
</template>

<script>
export default {
	props: ["palette"],
	data: function() {
		return {
			id: "",
			name: "",
			colors: [
				"rgba(0,0,0,1)",
				"rgba(0,0,0,1)",
				"rgba(0,0,0,1)",
				"rgba(0,0,0,1)",
				"rgba(0,0,0,1)"
			]
		}
	},
	mounted() {
		if (this.palette !== [] && this.palette) {
			this.id = this.palette.id
			this.name = this.palette.name
			this.colors = this.palette.colors
		}
	},
	methods: {
		finished() {
			this.$emit("finished", {
				id: this.id,
				name: this.name,
				colors: this.colors
			})
			this.$emit("closeForm")
		}
	}
}
</script>

<style lang="scss" scoped>
</style>
