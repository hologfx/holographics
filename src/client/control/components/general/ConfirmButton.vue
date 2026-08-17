<template lang="pug">
  button(@click="click", :disabled="isDisabled")
    slot(v-if="(this.clicked == 0)")
    | {{ this.clicked == 1 ? 'Are you sure?' : '' }}
</template>

<script>
export default {
	name: "ConfirmButton",
	data() {
		return {
			clicked: 0,
			timeout: 0
		}
	},
	props: ["actionName", "disabled"],

	computed: {
		isDisabled: function() {
			if (this.disabled) return "disabled"
			if (this.performing) return "disabled"
			return undefined
		},
		text: function() {
			if (this.clicked === 0) return this.actionName
			if (this.clicked === 1) return "Are you sure?"
			return ""
		}
	},
	methods: {
		click() {
			this.clicked++
			this.timeout = setTimeout(() => {
				this.clicked = 0
			}, 2000)
			if (this.clicked == 2) {
				clearTimeout(this.timeout)
				this.clicked = 0
				this.$emit("perform")
			}
		}
	}
}
</script>
