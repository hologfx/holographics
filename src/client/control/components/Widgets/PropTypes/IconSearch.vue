<template lang="pug">
div
  input.form-control.icon_search(
    autocomplete="off"
    :placeholder="prop.description"
    :value="value"
    @icon_changed.native="test"
    @change="$emit('input', $event.target.value)"
    :name="prop.name")
  .iconlist.mt-3
    ul.icons.ml-0.mr-0
</template>

<script>
import "@/util/icon_search.js"

export default {
	props: ["prop", "value"],
	methods: {
		test(event) {
			console.log(event)
			console.log("Icon changed called!")
		}
	},
	mounted() {
		$(".icon_search").icon_search()
		$(".icon_search").on("icon_changed", (event, icon) => {
			this.$emit("input", icon)
		})
	}
}
</script>

<style lang="scss">
ul.icons {
	list-style: none;
	overflow-y: scroll;
	padding: 0;
	border: 0;
	height: 20vh;

	li.btn {
		width: 24%;
		margin: 0.5%;
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		span {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}
</style>
