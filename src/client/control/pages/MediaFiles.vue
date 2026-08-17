<template lang="pug">
#settings.mt-3
  .container-fluid
    .row
      .col-md-12
        h2 Media Files
        p.lead Files placed in the media files directory will be available to widgets. Future versions of Holographics will include the ability to add files from this interface.
        div.mb-3
          button.btn.btn-secondary.mb-3.mr-2(@click.prevent="open_theme_dir" v-if="debug.appMode.environment == 'electron'") Open media files dir
          .card-columns
            MediaFilePreview(v-for="mediafile in mediafiles" :key="mediafile.filename" :mediafile="mediafile")

</template>

<script>
import { mapState } from "vuex"
import MediaFilePreview from "@/components/MediaFile/MediaFilePreview"

export default {
	name: "ThemeSelector",
	components: {
		MediaFilePreview
	},
	methods: {
		open_theme_dir() {
			this.$socket.emit("open-dir", "./mediafiles")
		}
	},
	computed: {
		...mapState(["mediafiles", "debug"])
	}
}
</script>
