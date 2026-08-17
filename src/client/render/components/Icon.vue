<template lang="pug">
  i(:class="iconClasses")
</template>

<script>
const iconList = require("@/util/fa_output.js")

export default {
	props: ["icon"],
	computed: {
		iconClasses() {
			return iconList.find(icon => {
				return icon.id === this.icon
			}).class
		}
	}
}
</script>
