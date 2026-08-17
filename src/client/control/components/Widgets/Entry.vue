<template lang="pug">
li.list-group-item.d-flex.justify-content-end
	span.mr-auto {{ firstProp }}
	div.btn-group.mr-2
		button.btn.btn-sm.btn-info(v-for="output in stillOutputs", :key="output.id", :output="output" @click="renderEntry(output)" :disabled="output.rendering.stills") {{ getOutputModule(output.type).name }}
	div.btn-group.mr-2
		button.btn.btn-sm.btn-success(:disabled="isVisible" @click="updateEntry({ id: entry.id, data: { visibility: true }})") Show
		button.btn.btn-sm.btn-danger(:disabled="!isVisible" @click="updateEntry({ id: entry.id, data: { visibility: false }})") Hide
	div.btn-group
		button.btn.btn-sm.btn-outline-warning(@click="$emit('editEntry', entry.id)") Edit
		ConfirmButton.btn.btn-sm.btn-outline-danger(@perform="removeEntry(entry.id)") Delete
</template>

<script>
import ConfirmButton from "@/components/general/ConfirmButton"

import { mapActions, mapState, mapGetters } from "vuex"

import Holographics from "../../lib/holographics-client"

export default {
	props: ["entry", "widget", "widgetModule"],
	components: {
		ConfirmButton
	},
	computed: {
		...mapGetters(["stillOutputs", "getOutputModule"]),
		firstProp() {
			return this.entry.props[this.widgetModule.entry_props[0].name]
		},
		isVisible() {
			return this.entry.visibility
		}
	},
	methods: {
		...mapActions(["updateEntry", "removeEntry"]),
		renderEntry(output) {
			Holographics.outputs
				.renderFrames({
					id: output.id,
					data: [this.entry.id]
				})
				.then(result => {
					console.log(result)
				})
		}
	}
}
</script>
