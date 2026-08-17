<template lang="pug">
	div
		#accordion(role='tablist', aria-multiselectable='true' v-if="!widgetModule.selfWrapping")
			.card.mb-3
				.card-header(role='tab')
					h4.mb-0
						a(data-toggle='collapse' href='#appearance' aria-controls="appearance" aria-expanded="false")
							| Appearance
				#appearance.collapse(role="tabpanel")
					.card-body
						Appearance(
							:widget_wrapping.sync="widget_wrapping"
							:mergedStyle="mergedStyle")
		#accordion(role='tablist', aria-multiselectable='true' v-if="!widgetModule.selfPositioning")
			.card.mb-3
				.card-header(role='tab')
					h4.mb-0
						a(data-toggle='collapse' href='#position' aria-controls="position" aria-expanded="false")
							| Position
				#position.collapse(role="tabpanel")
					.card-body
						Position(
							:mergedStyle="mergedStyle"
							:position_type.sync="position_type"
							:horizontal_position.sync="horizontal_position"
							:horizontal_offset.sync="horizontal_offset"
							:vertical_position.sync="vertical_position"
							:vertical_offset.sync="vertical_offset"
							:global_padding.sync="global_padding"
							:widget_offset.sync="widget_offset")
		#accordion(role='tablist', aria-multiselectable='true' v-if="!widgetModule.selfSizing")
			.card.mb-3
				.card-header(role='tab')
					h4.mb-0
						a(data-toggle='collapse' href='#sizing' aria-controls="sizing" aria-expanded="false")
							| Sizing
				#sizing.collapse(role="tabpanel")
					.card-body
						Sizing(
							:mergedStyle="mergedStyle"
							:widget_padding.sync="widget_padding"
							:font_size.sync="font_size"
							:width.sync="width"
							:height.sync="height")
		#accordion(role='tablist', aria-multiselectable='true' v-if="!widgetModule.selfAnimating")
			.card.mb-3
				.card-header(role='tab')
					h4.mb-0
						a(data-toggle='collapse' href='#animations' aria-controls="animations" aria-expanded="false")
							| Animations
				#animations.collapse(role="tabpanel")
					.card-body
						Animations(
							:mergedStyle="mergedStyle"
							:enter_animation.sync="enter_animation"
							:enter_duration.sync="enter_duration"
							:enter_ease.sync="enter_ease"
							:leave_animation.sync="leave_animation"
							:leave_duration.sync="leave_duration"
							:leave_ease.sync="leave_ease"
						)
						
</template>

<script>
import Position from "./StyleControls/Position"
import Sizing from "./StyleControls/Sizing"
import Appearance from "./StyleControls/Appearance"
import Animations from "./StyleControls/Animations"

function syncWidgetStyleProperty(property) {
	return {
		get: function() {
			return this.widget.style[property]
		},
		set: function(newValue) {
			if (newValue === undefined) {
				this.$emit("removeStyleKey", property)
			}
			this.$emit("change", { [property]: newValue })
		}
	}
}

export default {
	components: {
		Appearance,
		Position,
		Sizing,
		Animations
	},
	computed: {
		widget_wrapping: syncWidgetStyleProperty("widget_wrapping"),
		position_type: syncWidgetStyleProperty("position_type"),
		horizontal_position: syncWidgetStyleProperty("horizontal_position"),
		vertical_position: syncWidgetStyleProperty("vertical_position"),
		horizontal_offset: {
			get: function() {
				return this.widget.style.horizontal_offset
			},
			set: function(newOffset) {
				this.$emit("change", { horizontal_offset: Number(newOffset) })
			}
		},
		vertical_offset: {
			get: function() {
				return this.widget.style.vertical_offset
			},
			set: function(newOffset) {
				this.$emit("change", { vertical_offset: Number(newOffset) })
			}
		},
		global_padding: syncWidgetStyleProperty("global_padding"),
		widget_offset: syncWidgetStyleProperty("widget_offset"),
		widget_padding: syncWidgetStyleProperty("widget_padding"),
		font_size: syncWidgetStyleProperty("font_size"),
		width: syncWidgetStyleProperty("width"),
		height: syncWidgetStyleProperty("height"),
		enter_animation: syncWidgetStyleProperty("enter_animation"),
		enter_duration: syncWidgetStyleProperty("enter_duration"),
		enter_ease: syncWidgetStyleProperty("enter_ease"),
		leave_animation: syncWidgetStyleProperty("leave_animation"),
		leave_duration: syncWidgetStyleProperty("leave_duration"),
		leave_ease: syncWidgetStyleProperty("leave_ease")
	},
	props: ["mergedStyle", "widget", "widgetModule"]
}
</script>
