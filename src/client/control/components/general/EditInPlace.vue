<template lang="pug">
  div(@click="toggleEdit")
    slot.test(v-if="!edit")
    input.form-control(type="text" v-model="inputValue" ref="editInPlace" v-show="edit" @blur="saveEdit")
</template>

<script>
export default {
	props: ["value"],
	data() {
		return {
			edit: false,
			inputValue: ""
		}
	},
	methods: {
		toggleEdit: function() {
			this.inputValue = this.value
			this.edit = true

			// Focus input field
			this.$nextTick(() => {
				this.$refs.editInPlace.focus()
			})
		},

		saveEdit: function() {
			// save your changes
			this.edit = false
			this.$emit("changed", this.inputValue)
		}
	}
}
</script>
