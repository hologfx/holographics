<template lang="pug">
  .card
    img.img-thumbnail(:src="filepath" v-if="isImage")
    .card-body
      strong Filename: 
      | {{this.mediafile.filename}}
      br
      template(v-if="this.mediafile.filetype")
        strong Filetype: 
        | {{this.mediafile.filetype.mime}}
</template>

<script>
export default {
	props: ["mediafile"],
	computed: {
		filepath() {
			return `/mediafiles/${this.mediafile.filename}`
		},
		isImage() {
			const imageMimeTypes = [
				"image/jpeg",
				"image/gif",
				"image/png",
				"application/xml"
			]
			if (this.mediafile.filetype && this.mediafile.filetype.mime) {
				return imageMimeTypes.includes(this.mediafile.filetype.mime)
			} else {
				return false
			}
		}
	}
}
</script>
