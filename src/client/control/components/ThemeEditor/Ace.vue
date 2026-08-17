<template lang="pug">
  pre#editor_window(v-model="content")
</template>

<script>
import ace from "brace"
import "brace/mode/stylus"
import "brace/theme/cobalt"

export default {
	data() {
		return {
			editor: ""
		}
	},
	props: ["content"],
	mounted() {
		this.editor = ace.edit("editor_window")
		this.editor.setTheme("ace/theme/cobalt")
		this.editor.session.setMode("ace/mode/stylus")

		var options = {
			fontSize: 14,
			fixedWidthGutter: "",
			useSoftTabs: false,
			tabSize: 2,
			wrap: "off",
			foldStyle: "markbegin",
			showPrintMargin: false
		}

		this.editor.setOptions(options)
		this.editor.$blockScrolling = Infinity
	},
	methods: {
		setContents(contents) {
			this.editor.setValue(contents, -1)
			this.editor.clearSelection()
			this.editor.renderer.updateFull()
		}
	}
}
</script>

<style lang="scss">
#editor_window {
	height: 70vh;
}
</style>
