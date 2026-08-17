<template lang="pug">
ul.list-group
  draggable(v-model="entryList" group="entries" ghost-class="ghost")
    transition-group(type="transition" name="flip-list")
      Entry.draggable(
        v-for="entry in entryList"
        v-if="entry.widgetId == widget.id"
        :entry="entry"
        :key="entry.id"
        :widget="widget"
        :widgetModule="widgetModule"
        @editEntry="$emit('editEntry', $event)"
      )
</template>

<script>
import Entry from "./Entry"
import draggable from "vuedraggable"

export default {
	components: {
		Entry,
		draggable
	},
	computed: {
		entryList: {
			get() {
				return this.$store.state.entries
			},
			set(value) {
				this.$store.dispatch("setState", { entries: value })
			}
		}
	},
	props: ["widget", "widgetModule"]
}
</script>

<style lang="scss">
.draggable {
	cursor: move;
}
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
