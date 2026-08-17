<template lang="pug">
div
	button.btn.btn-primary.mb-2(@click="pickFolder") Select destination folder
	p.small.text-secondary {{ value }}
	button.btn.btn-sm.btn-secondary.mb-2(@click.prevent="$socket.emit('open-dir', value, true)") Open destination folder
</template>

<script>
export default {
	props: ["prop", "value"],
	methods: {
		pickFolder() {
			this.$socket.emit("pick-dir", "", response => {
				if (response.filePaths && response.filePaths.length > 0) {
					this.$emit("input", response.filePaths[0])
				}
			})
		}
	},
	filters: {
		filePath(path) {
			if (path) {
				const elms = path.split("/")
				elms[0] = elms[0] + elms[1]
				return elms.join(` > 📁`)
			} else {
				return ""
			}
		}
	}
}
</script>
