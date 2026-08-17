<template lang="pug">
	.animations
		label.form-control-label Enter animation
		.input-group.mb-3
			.input-group-prepend
				.input-group-text
					input(type="checkbox", v-model="enter_animation_overwrite")
			el-select(:value="enter_animation || mergedStyle.enter_animation" @input="$emit('update:enter_animation', $event)").mr-1
				el-option(v-for="animation in animations" :key="animation.filename" :label="animation.filename" :value="animation.filename")
		label.form-control-label Enter ease
		.input-group.mb-3
			.input-group-prepend
				.input-group-text
					input(type="checkbox", v-model="enter_ease_overwrite")
			el-select(:value="enter_ease || mergedStyle.enter_ease" @input="$emit('update:enter_ease', $event)").mr-1
				el-option(v-for="ease in eases" :key="ease" :label="ease" :value="ease")
		label.form-control-label Enter duration
		.input-group.mb-3
			.input-group-prepend
				.input-group-text
					input(type="checkbox", v-model="enter_duration_overwrite")
			input.form-control(
				type="number"
				:value="enter_duration || mergedStyle.enter_duration",
				@blur="$emit('update:enter_duration', $event.target.value)",
				:name="enter_duration"
			)
			.input-group-append
				span.input-group-text ms
		label.form-control-label Leave animation
		.input-group.mb-3
			.input-group-prepend
				.input-group-text
					input(type="checkbox", v-model="leave_animation_overwrite")
			el-select(:value="leave_animation || mergedStyle.leave_animation" @input="$emit('update:leave_animation', $event)").mr-1
				el-option(v-for="animation in animations" :key="animation.filename" :label="animation.filename" :value="animation.filename")
		label.form-control-label Leave ease
		.input-group.mb-3
			.input-group-prepend
				.input-group-text
					input(type="checkbox", v-model="leave_ease_overwrite")
			el-select(:value="leave_ease || mergedStyle.leave_ease" @input="$emit('update:leave_ease', $event)").mr-1
				el-option(v-for="ease in eases" :key="ease" :label="ease" :value="ease")
		label.form-control-label Leave duration
		.input-group.mb-3
			.input-group-prepend
				.input-group-text
					input(type="checkbox", v-model="leave_duration_overwrite")
			input.form-control(
				type="number"
				:value="leave_duration || mergedStyle.leave_duration",
				@blur="$emit('update:leave_duration', $event.target.value)",
				:name="leave_duration"
			)
			.input-group-append
				span.input-group-text ms
</template>

<script>
import { mapState, mapActions } from "vuex"
import Eases from "../../../../render/lib/eases"

function syncOverwrite(property) {
	return {
		get: function() {
			return this[property] !== undefined
		},
		set: function(checked) {
			this.$emit(
				`update:${property}`,
				checked ? this.mergedStyle[property] : undefined
			)
		}
	}
}

export default {
	props: [
		"mergedStyle",
		"enter_animation",
		"enter_duration",
		"enter_ease",
		"leave_animation",
		"leave_duration",
		"leave_ease"
	],
	computed: {
		...mapState(["animations", "style"]),
		eases() {
			return Object.keys(Eases)
		},
		enter_animation_overwrite: syncOverwrite("enter_animation"),
		enter_ease_overwrite: syncOverwrite("enter_ease"),
		enter_duration_overwrite: syncOverwrite("enter_duration"),
		leave_animation_overwrite: syncOverwrite("leave_animation"),
		leave_ease_overwrite: syncOverwrite("leave_ease"),
		leave_duration_overwrite: syncOverwrite("leave_duration")
	}
}
</script>
