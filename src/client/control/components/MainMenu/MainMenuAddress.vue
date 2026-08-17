<template lang="pug">
.input-group
  input.form-control(type="text" ref="addressInput" :value=`href || 'pending'` readonly @focus="$event.target.select()")
  span.input-group-append
    button.clipboard.btn.btn-outline-secondary(type="button" @click.prevent="copyPaste")
      i.fas.fa-clipboard
  span.input-group-append(v-if="browserButton !== false")
    button.open.btn.btn-outline-secondary(type="button" @click.prevent="browser")
      i.fab.fa-chrome
</template>

<script>
export default {
	props: ["href", "browserButton"],
	methods: {
		browser() {
			window.open(this.$refs.addressInput.value, "_blank")
		},
		copyPaste() {
			this.$refs.addressInput.select()
			try {
				document.execCommand("copy")
			} catch (err) {
				console.log("Couldn't copy to clipboard: " + err)
			}
		}
	}
}
</script>

<style lang="scss">
</style>
