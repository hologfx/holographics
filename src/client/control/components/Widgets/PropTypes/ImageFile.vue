<template lang="pug">
  div
    button.btn.btn-primary(@click="selecting = true" v-if="!selecting") Select image
    button.btn.btn-secondary.mb-3(@click="selecting = false" v-if="selecting") Cancel
    .card-columns(v-if="selecting")
      .card.imagepicker(v-for="image of imageFiles" :key="image.filename" :image="image" :class="{ 'bg-primary': isActive(image.filename) }" @click="selectImage(image.filename)").p-1
        img.img-fluid(:src='imageUrl(image.filename)')
</template>

<script>
import { mapState } from "vuex"

export default {
	props: ["prop", "value"],
	data() {
		return {
			selecting: false
		}
	},
	methods: {
		imageUrl(filename) {
			return `/mediafiles/${filename}`
		},
		selectImage(filename) {
			this.$emit("input", filename)
			this.selecting = false
		},
		isActive(filename) {
			if (filename === this.value) return true
		}
	},
	computed: {
		...mapState(["mediafiles"]),
		imageFiles() {
			const imageMimeTypes = ["image/jpeg", "image/gif", "image/png"]
			return this.mediafiles.filter(mediafile => {
				if (mediafile.filetype && mediafile.filetype.mime) {
					return imageMimeTypes.includes(mediafile.filetype.mime)
				} else {
					return false
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.imagepicker {
	cursor: pointer;
}
</style>
