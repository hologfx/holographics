<template lang="pug">
#dashboard.mt-3
	.container-fluid(v-if="!removing")
		.row
			.col-lg-8
				//- WIDGET TITLE
				EditInPlace.mb-3(:value="widgetName(widget)", @changed="updateWidget({ id: widget.id, data: { name: $event }})")
					div.d-flex
						h2.m-0 {{ widgetName(widget) }}
						a.fas.fa-edit.fa-xs.text-muted.ml-2
				
				//- HIDE & SHOW BUTTONS
				div.btn-group.mr-2.mb-3(v-if="!widgetModule.hasEntries")
					button.btn.btn-lg.btn-success(:disabled="isVisible(widget)" @click="updateWidget({ id: widget.id, data: { props: { visibility: true }}})") Show
					button.btn.btn-lg.btn-danger(:disabled="!isVisible(widget)" @click="updateWidget({ id: widget.id, data: { props: { visibility: false }}})") Hide
				
				//- OUTPUTS
				div.mb-3(v-for="output in stillOutputs", :key="output.id", :output="output")
					button.btn.btn-info(@click="renderWidget(output)" :disabled="output.rendering.stills" )
						i.fas.fa-spinner.fa-spin.mr-2(v-if="output.rendering.stills")
						| Render{{ widgetModule.hasEntries ? " all " : " " }}to {{ getOutputModule(output.type).name }}	
						span.ml-2(v-if="output.rendering.stills") {{ output.rendering.current }}/{{ output.rendering.total }}

				//- CREATE ENTRY BUTTON
				button.mb-3.btn.btn-primary(@click="creatingEntry = true" v-if="!creatingEntry && widgetModule.hasEntries") New entry
				
				//- WIDGET ACTIONS
				Actions.mb-3(:actions="widgetModule.actions" :widget="widget" v-if="widgetModule.actions.length > 0")

				//- CREATE ENTRY
				Props.mb-3(:props="widgetModule.entry_props" v-if="creatingEntry" @submit="createEntry" @cancel="creatingEntry = false" submittable) Create
				
				//- EDIT ENTRY
				Props.mb-3(:props="widgetModule.entry_props" :prop_values="editingEntry.props" v-if="editingEntry" @submit="updateEntry" @cancel="editingEntry = false" submittable) Update

				//- WIDGET PROPS
				Props.mb-3(:props="widgetModule.props" :prop_values="widget.props" v-if="widgetModule.props.length > 0" @change="updateWidget({ id: widget.id, data: { props: $event }})")
				
				//- ENTRY LIST
				Entries(:widget="widget" :widgetModule="widgetModule" @editEntry="editEntry")
			.col-lg-4
				//- SIDEBAR CONTROLS
				StyleControls(
					:widget="widget"
					:widgetModule="widgetModule"
					:mergedStyle="mergedStyle"
					 @change="updateWidget({ id: widget.id, data: { style: $event } })"
					 @removeStyleKey="removeStyleKey({ id: widget.id, key: $event })")
				ConfirmButton.btn.btn-danger.btn-block(@perform="remove") Delete Widget

</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
import ConfirmButton from "@/components/general/ConfirmButton"
import EditInPlace from "@/components/general/EditInPlace"

// Widget components
import Entries from "@/components/Widgets/Entries"
import Props from "@/components/Widgets/Props"
import Actions from "@/components/Widgets/Actions"
import StyleControls from "@/components/Widgets/StyleControls"

import Holographics from "../lib/holographics-client"

export default {
	data() {
		return {
			creatingEntry: false,
			editingEntry: false,
			removing: false
		}
	},
	components: {
		ConfirmButton,
		EditInPlace,
		Entries,
		Props,
		Actions,
		StyleControls
	},
	methods: {
		createEntry(event) {
			this.creatingEntry = false
			this.$store.dispatch("createEntry", {
				data: {
					widgetId: this.widget.id,
					props: { ...event }
				}
			})
		},
		updateEntry(event) {
			this.$store.dispatch("updateEntry", {
				id: this.editingEntry.id,
				data: {
					props: { ...event }
				}
			})
			this.editingEntry = false
		},
		editEntry(event) {
			this.$set(this, "editingEntry", false)
			this.$nextTick(() => {
				this.$set(this, "editingEntry", this.getEntryById(event))
			})
		},
		remove() {
			this.removing = true
			this.removeWidget(this.widget).then(() => {
				if (this.widgets.length > 0) {
					this.$router.replace({
						name: "Widget",
						params: { id: this.widgets[0].id }
					})
				} else {
					this.$router.replace({ name: "Widgets" })
				}
			})
		},
		renderWidget(output) {
			if (this.widgetModule.hasEntries) {
				Holographics.outputs
					.renderFrames({
						id: output.id,
						data: this.getEntriesByWidgetId(this.widget.id).map(e => e.id)
					})
					.then(result => {
						console.log(result)
					})
			} else {
				Holographics.outputs
					.renderFrames({
						id: output.id,
						data: [this.widget.id]
					})
					.then(result => {
						console.log(result)
					})
			}
		},
		...mapActions(["removeWidget", "updateWidget", "removeStyleKey"])
	},
	computed: {
		...mapState(["widgets", "outputs", "outputModules"]),
		...mapGetters([
			"getWidgetModule",
			"getWidgetById",
			"getMergedStyle",
			"getEntriesByWidgetId",
			"getEntryById",
			"getOutputModule",
			"isVisible",
			"widgetName",
			"stillOutputs"
		]),
		mergedStyle() {
			return this.getMergedStyle(this.widget)
		},
		widget() {
			return this.getWidgetById(this.$route.params.id)
		},
		widgetModule() {
			return this.getWidgetModule(this.widget.type)
		}
	}
}
</script>

<style lang="scss"></style>
