<template lang="pug">
	div
		button.btn.btn-primary(@click="selecting = true" v-if="!selecting") Select video
		button.btn.btn-secondary.mb-3(@click="selecting = false" v-if="selecting") Cancel
		.card-columns(v-if="selecting")
			.card.videopicker(v-for="video of videoFiles" :key="video.filename" :video="video" :class="{ 'bg-primary': isActive(video.filename) }" @click="selectVideo(video.filename)").p-1
				video(:src="videoUrl(video.filename)" muted autoplay v-if="shouldPreview")
				template(v-else)
					strong Filename: 
					| {{video.filename}}
					br
					template(v-if="this.mediafile.filetype")
						strong Filetype: 
						| {{video.filetype.mime}}
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
		videoUrl(filename) {
			return `/mediafiles/${filename}`
		},
		selectVideo(filename) {
			this.$emit("input", filename)
			this.selecting = false
		},
		isActive(filename) {
			if (filename === this.value) return true
		}
	},
	computed: {
		...mapState(["mediafiles"]),
		videoFiles() {
			const videoMimeTypes = [
				"video/mp4",
				"video/webm",
				"application/ogg",
				"video/ogg"
			]
			return this.mediafiles.filter(mediafile => {
				if (mediafile.filetype && mediafile.filetype.mime) {
					return videoMimeTypes.includes(mediafile.filetype.mime)
				} else {
					return false
				}
			})
		},
		shouldPreview() {
			if (this.videoFiles.length > 3) return false
			return true
		}
	}
}
</script>

<style lang="scss" scoped>
.videopicker {
	cursor: pointer;

	video {
		width: 100%;
		height: auto;
	}
}
</style>
