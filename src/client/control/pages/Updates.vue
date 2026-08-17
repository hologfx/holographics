<template lang="pug">
#dashboard.mt-3
	.container-fluid
		.row(v-if="debug.appMode.packed && debug.appMode.environment !== 'electron'")
			.col-md-6
				h2 Updates
				p Automatic updates not yet available for containerized distributions.
		.row(v-else)
			.col-md-6.mb-3
				h2 Updates
				p(v-if="!updates.newerVersionAvailable") You have the latest version on the {{ updatechannel | channelName }} channel.
				.alert.alert-primary(v-if="updates.newerVersionAvailable")
					strong A new version is available!
				p(v-if="updates.newerVersionAvailable") The latest version is {{ updates.updateInfo.version }}. You are running {{ currentVersion }}
				div(v-if="updates.downloading || updates.readyToInstall").mb-3
					p.
						<strong>Speed:</strong> {{ Math.round(updates.downloadProgress.bytesPerSecond * 100) / 100 | format_size }}/s<br />
						<strong>Filesize:</strong> {{ Math.round(updates.downloadProgress.total * 100) / 100 | format_size }}<br />
						<strong>Downloaded:</strong> {{ Math.round(updates.downloadProgress.transferred * 100) / 100 | format_size }}<br />
					el-progress(:percentage="Math.round(updates.downloadProgress.percent * 100) / 100")
				div.mb-3
					el-button(@click="checkForUpdates" :loading="updates.checkingForUpdates" v-if="!updates.newerVersionAvailable") {{ updates.checkingForUpdates ? 'Checking' : 'Check for update' }}
					el-button(type="primary" @click="downloadUpdate" v-if="updates.newerVersionAvailable && !updates.readyToInstall && !updates.downloading") Download now
					el-button(type="danger" @click="cancelDownload" v-if="updates.downloading") Cancel download
					el-button(type="primary" @click="quitAndInstall" v-if="updates.readyToInstall") Install update (restarts the application)
				
				div.mb-5
					h3 Update channel
					div
						el-radio(v-model="updatechannel" label="latest" border) Stable
						el-radio(v-model="updatechannel" label="beta" border) Beta
						el-radio(v-model="updatechannel" label="alpha" border) Alpha (test builds only)
			.col-md-6
				div#changelog
					VueMarkdown(:source="updates.updateInfo.releaseNotes" :linkify="false")
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import VueMarkdown from "vue-markdown"

export default {
	components: {
		VueMarkdown
	},
	mounted() {
		if (
			this.debug.appMode.development ||
			this.debug.appMode.environment === "electron"
		) {
			this.checkForUpdates()
		}
	},
	methods: {
		...mapActions([
			"checkForUpdates",
			"downloadUpdate",
			"cancelDownload",
			"quitAndInstall"
		])
	},
	computed: {
		...mapState(["updates", "debug"]),
		...mapGetters(["currentVersion"]),
		updatechannel: {
			get() {
				return this.$store.state.settings.updates.channel
			},
			set(channel) {
				console.log(channel)
				this.$store.dispatch("updateSetting", {
					updates: { channel }
				})
			}
		}
	},
	filters: {
		channelName(name) {
			if (name === "latest") return "stable"
			return name
		}
	}
}
</script>

<style lang="scss">
#changelog {
	height: 70vh;
	overflow-y: scroll;
	background: rgba(0, 0, 0, 1) // Intro text
		p {

	}
	// Version number
	h1 {
		font-family: "Ubuntu";
		font-size: 1.5rem;
		margin-right: 0.5em;
		border-bottom: 3px solid rgb(69, 151, 251);
	}
	h1:not(:first-child) {
		margin-top: 3rem;
	}
	span.date {
		font-size: 0.875rem;
		color: #6c757d;
	}

	// Version header
	h2 {
		font-size: 1rem;
		font-weight: bolder;
		text-transform: uppercase;
	}
	// Fixes, Features etc
	h3 {
		display: none;
	}
	// Bulletpoints
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		li {
			margin: 0;
			padding: 0.5rem 0;
			color: #6c757d;

			span.type {
				padding: 0.3rem 0.5rem;
				color: white;
				font-weight: bold;
				margin-right: 1rem;
				&.FEATURE {
					background: #5cb85c;
					&:before {
						content: "🍪 ";
					}
				}
				&.FIXED {
					background: #d9534f;
					&:before {
						content: "🔧 ";
					}
				}
				&.CHANGED {
					background: rgb(69, 206, 251);
					&:before {
						content: "📝 ";
					}
				}
				&.IMPROVED {
					background: #e83e8c;
					&:before {
						content: "☎️ ";
					}
				}
				&.PERFORMANCE {
					background: #7c4dff;
					&:before {
						content: "🏎️ ";
					}
				}
				&.DEPRECATED {
					background: #f0ad4e;
					&:before {
						content: "👴🏻 ";
					}
				}
				&.BREAKING {
					background: #d9534f;
					&:before {
						content: "💥 ";
					}
				}
				&.KNOWN {
					background: #be4eff;
					&:before {
						content: "💣 ";
					}
				}
			}
		}
	}
}
</style>
