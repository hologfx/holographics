<template lang="pug">
div.d-flex.justify-content-between(@mouseover="hover = true" @mouseleave="hover = false")
  router-link.widgetlink.list-group-item.list-group-item-action.d-flex.justify-content-between(:to='page' :class="{ hover }")
    div
      i.fa.fa-fw.mt-1.mr-2(:class='icon')
      | {{ widgetName(widget) }}
    div
      span.eye.badge(:class="eyeBadgeColor")
        i.far.fa-lg.fa-fw(:class="visibilityIcon")
  button.widgetmenuactionbutton.btn.btn-lg.btn-danger(@click="setVisibility({ id: widget.id, visibility: false })" v-show="hover && isVisible(widget) && canToggle") Hide
  button.widgetmenuactionbutton.btn.btn-lg.btn-success(@click="setVisibility({ id: widget.id, visibility: true })" v-show="hover && !isVisible(widget) && canToggle") Show

</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
	props: ["page", "widget"],
	data() {
		return {
			hover: false
		}
	},
	computed: {
		...mapGetters([
			"getWidgetModule",
			"getEntriesByWidgetId",
			"widgetName",
			"isVisible"
		]),
		icon() {
			return `fa-${this.getWidgetModule(this.widget.type).icon}`
		},
		visibilityIcon() {
			return this.isVisible(this.widget) ? "fa-eye" : "fa-eye-slash"
		},
		eyeBadgeColor() {
			return this.isVisible(this.widget) ? "badge-success" : "badge-secondary"
		},
		canToggle() {
			if (this.getWidgetModule(this.widget.type).hasEntries) {
				return this.getEntriesByWidgetId(this.widget.id).length !== 0
			} else {
				return true
			}
		}
	},
	methods: {
		...mapActions(["setVisibility"])
	}
}
</script>

<style lang="scss">
a.widgetlink {
	cursor: move;
	&.hover {
		border-bottom-left-radius: 0px;
		border-bottom-right-radius: 0px;
		border-top-right-radius: 0px;
	}
}
button.widgetmenuactionbutton {
	border-top-left-radius: 0px;
	border-bottom-left-radius: 0px;
	border-bottom-right-radius: 0px;
	border: 1px solid rgba(0, 0, 0, 0.125);
	margin-bottom: -1px;
}
</style>
