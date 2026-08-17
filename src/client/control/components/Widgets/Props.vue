<template lang="pug">
	div
		template(
			v-for="prop in props"
			)
			label.form-control-label(style="display:block")
				| {{prop.description}}
				el-popover.ml-1(
					placement="top"
					width="300"
					trigger="hover")
					p You need to hide and show this widget for a change to this property to take effect.
					span.badge.badge-warning(v-if="prop.requires_refresh" slot="reference") Requires refresh
			component.mb-2(
				:is="prop.type"
				:key="prop.name"
				v-model="new_prop_values[prop.name]"
				@input="handleChange"
				:prop="prop")
		button.btn.btn-primary.mr-2(v-if="submittable" @click="$emit('submit', new_prop_values)" type="submit")
			slot(v-if="submittable")
		button.btn.btn-outline-secondary(v-if="submittable" @click="$emit('cancel')") Cancel
</template>

<script>
import String from "./PropTypes/String"
import IconSearch from "./PropTypes/IconSearch"
import Radio from "./PropTypes/Radio"
import Datetime from "./PropTypes/Datetime"
import Select from "./PropTypes/Select"
import ImageFile from "./PropTypes/ImageFile"
import Number from "./PropTypes/Number"
import VideoFile from "./PropTypes/VideoFile"
import FolderPicker from "./PropTypes/FolderPicker"
import ResolutionPicker from "./PropTypes/ResolutionPicker"
import ColorPicker from "./PropTypes/ColorPicker"

export default {
	components: {
		String,
		IconSearch,
		Radio,
		Datetime,
		Select,
		ImageFile,
		Number,
		VideoFile,
		FolderPicker,
		ResolutionPicker,
		ColorPicker
	},
	data() {
		return {
			new_prop_values: {}
		}
	},
	methods: {
		handleChange() {
			if (!this.submittable) {
				this.$emit("change", this.new_prop_values)
			}
		}
	},
	mounted() {
		this.props.forEach(prop => {
			if (this.prop_values)
				this.$set(this.new_prop_values, prop.name, this.prop_values[prop.name])
		})
	},
	props: {
		submittable: Boolean,
		props: Array,
		prop_values: Object
	}
}
</script>
