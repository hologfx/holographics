// Receives the widget, widgetModule and entries as props.
export default {
	computed: {
		youtubeUrl() {
			if (!this.widget.props.videoUrl) return ""
			var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
			var match = this.widget.props.videoUrl.match(regExp)
			const videoId = match && match[7].length == 11 ? match[7] : false

			if (this.widget.props.looping) {
				return `https://www.youtube.com/embed/${videoId}?rel=0&amp;controls=0&amp;showinfo=0&amp;loop=1&amp;autoplay=1&amp;playlist=${videoId}`
			} else {
				return `https://www.youtube.com/embed/${videoId}?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=1`
			}
		},
		aspectClass() {
			return `embed-responsive-${this.widget.props.aspect}`
		}
	}
}
