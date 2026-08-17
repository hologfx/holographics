<template lang="pug">
  el-button(:type="buttonType", :class="icon" :loading="loading" :disabled="!allowRefresh" @click="getState" circle)
</template>

<script>
import Holographics from "../lib/holographics-client"

export default {
	data: function() {
		return {
			loading: false,
			check: false,
			error: false,
			allowRefresh: true
		}
	},
	mounted() {
		Holographics.on("request", () => {
			this.loading = true
		})
		Holographics.on("response", () => {
			this.loading = false
			this.check = true
			setTimeout(() => {
				this.check = false
			}, 600)
		})
		Holographics.on("error", () => {
			this.loading = false
			this.error = true
			setTimeout(() => {
				this.error = false
			}, 600)
		})
	},
	computed: {
		buttonType() {
			if (this.error) return "danger"
			if (this.loading) return "warning"
			if (this.check) return "success"
			if (this.allowRefresh) return "info"
			return ""
		},
		icon() {
			if (this.error) return "el-icon-close"
			if (this.check) return "el-icon-check"
			if (this.allowRefresh) return "el-icon-refresh"
			return ""
		}
	},
	methods: {
		getState() {
			this.$store.dispatch("getInitialState")
		}
	}
}
</script>

<style lang="scss" scoped>
button.el-button {
	font-size: 1.5em;
}
</style>
