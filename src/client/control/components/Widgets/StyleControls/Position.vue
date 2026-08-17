<template lang="pug">
.position
	//- label.form-control-label Position Type
	//- .input-group.mb-3
	//- 	el-radio-group
	//- 		el-radio-button(label="Absolute") Absolute
	//- 		el-radio-button(label="Grid") Grid
	label.form-control-label Grid Positioning
	.input-group.mb-3
		GridPositionSelector(
			:horizontal_position="horizontal_position || mergedStyle.horizontal_position",
			:vertical_position="vertical_position || mergedStyle.vertical_position"
			v-on:change-horizontal="$emit('update:horizontal_position', $event)"
			v-on:change-vertical="$emit('update:vertical_position', $event)"
			)

	label.form-control-label Horizontal Offset from grid position
	.input-group.mb-3
		input.form-control(
			:placeholder="0",
			:value="horizontal_offset || mergedStyle.horizontal_offset",
			@blur="$emit('update:horizontal_offset', $event.target.value)",
			:name="horizontal_offset"
		)
		.input-group-append
			span.input-group-text %
	label.form-control-label Vertical Offset from grid position
	.input-group.mb-3
		input.form-control(
			:placeholder="0",
			:value="vertical_offset || mergedStyle.vertical_offset",
			@blur="$emit('update:vertical_offset', $event.target.value)",
			:name="vertical_offset"
		)
		.input-group-append
			span.input-group-text %
	label.form-control-label Render Edge Margin
	.input-group.mb-3
		.input-group-prepend
			.input-group-text
				input(type="checkbox", v-model="global_padding_overwrite")
		input.form-control(
			:placeholder="0",
			:value="global_padding || mergedStyle.global_padding",
			@blur="$emit('update:global_padding', $event.target.value)",
			:name="global_padding"
		)
	label.form-control-label Distance to previous widget
	.input-group.mb-3
		.input-group-prepend
			.input-group-text
				input(type="checkbox", v-model="widget_offset_overwrite")
		input.form-control(
			:placeholder="0",
			:value="widget_offset || mergedStyle.widget_offset",
			@blur="$emit('update:widget_offset', $event.target.value)",
			:name="widget_offset"
		)
</template>

<script>
import GridPositionSelector from "../../general/GridPositionSelector"

export default {
	components: {
		GridPositionSelector
	},
	props: [
		"mergedStyle",
		"horizontal_position",
		"vertical_position",
		"horizontal_offset",
		"vertical_offset",
		"global_padding",
		"widget_offset"
	],
	computed: {
		global_padding_overwrite: {
			get: function() {
				return this.global_padding !== undefined
			},
			set: function(checked) {
				this.$emit(
					"update:global_padding",
					checked ? this.mergedStyle.global_padding : undefined
				)
			}
		},
		widget_offset_overwrite: {
			get: function() {
				return this.widget_offset !== undefined
			},
			set: function(checked) {
				this.$emit(
					"update:widget_offset",
					checked ? this.mergedStyle.widget_offset : undefined
				)
			}
		}
	}
}
</script>

<style lang="scss"></style>
