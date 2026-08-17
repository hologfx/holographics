<template lang="pug">
#settings.mt-3
	.container-fluid
		.row
			.col-lg-9
				h2 Themes
				div.mb-3
					.card-columns
						a.card.themeselector(v-for="theme in themes", :key="theme.filename", @click="setTheme(theme.filename)" :class="{ 'bg-light': !activeTheme(theme), 'bg-primary': activeTheme(theme) }")
							.card-header
								| {{theme.variables.NAME || theme.filename}} <span class="text-muted">{{theme.variables.NAME ? `(${theme.filename})` : ''}}</span>
								span.ml-1.badge.badge-danger(v-if="theme.error") Invalid
								span.ml-1.badge.badge-info(v-if="theme.originality.default && theme.originality.modified") Modified default theme
								span.ml-1.badge.badge-info(v-if="!theme.originality.default") User theme
							.card-body
								p.card-text {{ theme.variables.DESCRIPTION || '' }}
			.col-lg-3
				.alert.alert-info.mb-3
					p.mb-3 Themes change the general look and feel of widgets. The colors set on the colors page are fed into themes allowing quick modification, though some themes will overwrite this. They are simple .Styl files (Stylus, a variant of CSS). You can open the source files to see how they work and customize them to your needs. Changes refresh instantly.
					button.btn.btn-secondary.mb-3.mr-2(@click.prevent="$socket.emit('open-dir', './themes')" v-if="debug.appMode.environment == 'electron'") Open themes directory
					p.mb-3 Sometimes after an update, not all default themes can be safely overwritten. If this happens, use this button to reset all themes back to defaults.
					el-popover.mb-3.mr-2(
						placement="top"
						width="300"
						trigger="hover")
						p Resetting your themes will discard any changes you may have made to default themes.
						ConfirmButton.btn.btn-danger(@perform="reset_themes" slot="reference") Reset default themes
</template>

<script>
import { mapState, mapActions } from "vuex"
import ConfirmButton from "@/components/general/ConfirmButton"

export default {
	components: {
		ConfirmButton
	},
	name: "ThemeSelector",
	mounted() {
		this.$store.dispatch("getThemes").then(() => {
			this.$forceUpdate()
		})
	},
	methods: {
		...mapActions(["reset_themes"]),
		open_theme_dir() {
			this.$socket.emit("open-dir", "./themes")
		},
		setTheme(theme) {
			this.$store.dispatch("updateState", { style: { activeTheme: theme } })
		},
		activeTheme(theme) {
			if (theme.filename == this.style.activeTheme) return true
			return false
		}
	},
	computed: {
		...mapState(["style", "themes", "debug"])
	}
}
</script>

<style lang="scss">
.themeselector {
	cursor: pointer;
}
</style>
