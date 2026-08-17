<template lang="pug">
#menu
  div#navigation.list-group.mb-3.mt-3(@click="expanded = !expanded")
    .list-group-item.list-group-item-action.text-center
      i.fas.fa-fw.fa-bars.mt-1.mr-2
      | Settings
  div#navigation.list-group.mb-3.mt-3(v-if="expanded")
    MenuItem(page='/updates' icon="download" v-if="debug.appMode.development || debug.appMode.environment === 'electron'")
      | Updates
      span.badge.badge-danger.badge-pill.ml-2(v-if="newerVersionAvailable") 1

    MenuItem(page='/settings' icon="cog") Settings
    MenuItem(page='/colorsettings' icon="palette") Colors
    MenuItem(page='/outputs' icon="broadcast-tower") Outputs
    MenuItem(page='/sizesettings' icon="sliders-h") Size &amp; Position
    MenuItem(page='/animations' icon="fighter-jet") Animations
    MenuItem(page='/mediafiles' icon="image") Media Files
    MenuItem(page='/themes' icon="th-list") Themes
    MenuItem(page='/theme_editor' icon="paint-roller") Theme Editor
    MenuItem(page='/development' icon="bug" v-if="isDebugState") Developer
  div#navigation.list-group.mb-3.mt-3
    draggable(v-model="widgetList" group="widgets" ghost-class="ghost" @change="sortWidget")
      transition-group(type="transition" name="flip-list")
        MainMenuWidgetItem(v-for="widget of $store.state.widgets" :key="widget.id" :widget="widget", :page="'/widget/' + widget.id") Test
    MenuItem(page='/widgets')
      div.text-center
        i.fa.fa-fw.fa-lg.fa-plus
        | Add
  
  div#navigation.list-group.mb-3.mt-3
    p.mb-0
      strong Render view (Chrome only)
    MainMenuAddress(:href="renderAddress").mb-3
    p.mb-0
      strong Control view
    MainMenuAddress(:href="controlAddress")
    
</template>

<script>
import MenuItem from "./MainMenuItem"
import MainMenuWidgetItem from "./MainMenuWidgetItem"
import ExternalMenuItem from "./MainMenuExternalItem"
import MainMenuAddress from "./MainMenuAddress"

import draggable from "vuedraggable"
import { mapState } from "vuex"

export default {
	data() {
		return {
			expanded: false
		}
	},
	components: {
		MenuItem,
		MainMenuWidgetItem,
		ExternalMenuItem,
		MainMenuAddress,
		draggable
	},
	computed: {
		...mapState(["settings", "status", "debug"]),
		newerVersionAvailable() {
			return this.$store.state.updates.newerVersionAvailable || false
		},
		isDebugState() {
			if (this.settings.logging.level === "MEDIUM") return true
			if (this.settings.logging.level === "HIGH") return true
			return false
		},
		renderAddress() {
			if (this.status) {
				return `http://${this.$store.state.status.ip}:${
					this.$store.state.status.port
				}/render`
			}
			return window.document.location.origin + "/render"
		},
		controlAddress() {
			if (this.status) {
				return `http://${this.$store.state.status.ip}:${
					this.$store.state.status.port
				}/control`
			}
			return window.document.location.origin + "/control"
		},
		widgetList: {
			get() {
				return this.$store.state.widgets
			},
			set(value) {
				this.$store.dispatch("setState", { widgets: value })
			}
		}
	},
	methods: {
		sortWidget(event) {
			// this.$store.dispatch('updateWidget', { id: event.moved.element.id, data: { sort: event.moved.newIndex }})
		}
	}
}
</script>

<style lang="scss">
.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}
.flip-list-move {
	transition: transform 0.5s;
}
.no-move {
	transition: transform 0s;
}
</style>
