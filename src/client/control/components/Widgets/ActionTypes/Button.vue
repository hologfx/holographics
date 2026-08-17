<template lang="pug">
button.btn(:class="buttonStyle" @click="runWidgetMethod({ id: widget.id, method: action.method, params: action.params })") {{ action.title }}
</template>

<script>
import { mapActions } from "vuex"

export default {
	props: ["action", "widget"],
	computed: {
		buttonStyle() {
			try {
				return `btn-${this.action.style.type}`
			} catch (e) {
				return "btn-default"
			}
		}
	},
	methods: {
		...mapActions(["runWidgetMethod"])
	}
}
</script>
