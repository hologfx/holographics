<template lang="pug">
  .sizing
    label.form-control-label Widget Padding
    .input-group.mb-3
      .input-group-prepend
        .input-group-text
          input(
            type="checkbox"
            v-model="widget_padding_overwrite")
      input.form-control(
        :placeholder="0"
        :value="widget_padding || mergedStyle.widget_padding"
        @blur="$emit('update:widget_padding', $event.target.value)"
        :name="widget_padding")
    label.form-control-label Font Size
    .input-group.mb-3
      .input-group-prepend
        .input-group-text
          input(
            type="checkbox"
            v-model="font_size_overwrite")
      input.form-control(
        :placeholder="0"
        :value="font_size || mergedStyle.font_size"
        @blur="$emit('update:font_size', $event.target.value)"
        :name="font_size")
    label.form-control-label Width Override
    .input-group.mb-3
      .input-group-prepend
        .input-group-text
          input(
            type="checkbox"
            v-model="width_overwrite")
      input.form-control(
        :placeholder="0"
        :value="width || mergedStyle.width"
        @blur="$emit('update:width', $event.target.value)"
        :name="width")
      .input-group-append
        span.input-group-text %
    label.form-control-label Height Override
    .input-group.mb-3
      .input-group-prepend
        .input-group-text
          input(
            type="checkbox"
            v-model="height_overwrite")
      input.form-control(
        :placeholder="0"
        :value="height || mergedStyle.height"
        @blur="$emit('update:height', $event.target.value)"
        :name="height")
      .input-group-append
        span.input-group-text %
</template>

<script>
export default {
	props: ["mergedStyle", "widget_padding", "font_size", "width", "height"],
	computed: {
		widget_padding_overwrite: {
			get: function() {
				return this.widget_padding !== undefined
			},
			set: function(checked) {
				this.$emit(
					"update:widget_padding",
					checked ? this.mergedStyle.widget_padding : undefined
				)
			}
		},
		font_size_overwrite: {
			get: function() {
				return this.font_size !== undefined
			},
			set: function(checked) {
				this.$emit(
					"update:font_size",
					checked ? this.mergedStyle.font_size : undefined
				)
			}
		},
		width_overwrite: {
			get: function() {
				return this.width !== undefined
			},
			set: function(checked) {
				this.$emit(
					"update:width",
					checked ? this.mergedStyle.width || "0" : undefined
				)
			}
		},
		height_overwrite: {
			get: function() {
				return this.height !== undefined
			},
			set: function(checked) {
				this.$emit(
					"update:height",
					checked ? this.mergedStyle.height || "0" : undefined
				)
			}
		}
	}
}
</script>
