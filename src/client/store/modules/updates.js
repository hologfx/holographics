import Holographics from "../../control/lib/holographics-client"
import Vue from "vue"

export default {
	state: {
		updateInfo: {},
		checkingForUpdates: false,
		downloading: false,
		downloadProgress: {
			bytesPerSecond: 0,
			total: 0,
			transferred: 0,
			percent: 0
		},
		newerVersionAvailable: false,
		noReleases: false,
		readyToInstall: false,
		newUpdateChannel: "latest"
	},
	getters: {
		currentVersion: (state, getters, rootState) => {
			return rootState.status.version || ""
		},
		getChannelName: (state, getters, rootState) => {
			if (rootState.settings && rootState.settings.updates) {
				return rootState.settings.updates.channel
			}
		}
	},
	mutations: {
		"SOCKET_download-progress": (state, progressInfo) => {
			Vue.set(state, "downloadProgress", progressInfo)
		},
		"SOCKET_update-downloaded": state => {
			Vue.set(state, "downloading", false)
			Vue.set(state, "readyToInstall", true)
		},
		setCheckingForUpdates(state, isChecking) {
			state.checkingForUpdates = isChecking
		},
		setDownloading(state, isDownloading) {
			state.downloading = isDownloading
		},
		setNewerVersionAvailable(state, isAvailable) {
			state.newerVersionAvailable = isAvailable
		},
		setNoReleases(state, noReleases) {
			state.noReleases = noReleases
		},
		setUpdateInfo(state, updateInfo) {
			Vue.set(state, "updateInfo", updateInfo)
		},
		setNewUpdateChannel(state, newUpdateChannel) {
			state.newUpdateChannel = newUpdateChannel
		}
	},
	actions: {
		async checkForUpdates({ commit }) {
			commit("setNewerVersionAvailable", false)
			commit("setNoReleases", false)
			commit("setUpdateInfo", {})
			commit("setCheckingForUpdates", true)
			Holographics.once("error", () => {
				commit("setCheckingForUpdates", false)
			})
			Holographics.update.get().then(response => {
				commit("setCheckingForUpdates", false)
				commit("setUpdateInfo", response.updateInfo || {})
				commit("setNewerVersionAvailable", response.newer === true)
				commit("setNoReleases", response.noReleases === true)
			})
		},
		async downloadUpdate({ commit }) {
			commit("setDownloading", true)
			Holographics.update.download()
		},
		async cancelDownload({ commit }) {
			Holographics.update.cancelDownload()
			commit("setDownloading", false)
		},
		async quitAndInstall({ commit }) {
			Holographics.update.install()
		},
		async changeUpdateChannel({ state, commit, dispatch }) {
			Holographics.settings
				.patch({
					data: {
						updates: { channel: state.newUpdateChannel }
					}
				})
				.then(() => {
					dispatch("checkForUpdates")
				})
		}
	}
}
